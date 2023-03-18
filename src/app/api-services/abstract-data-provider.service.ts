import { Injectable, Inject } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { LocalStorageHelper } from '../helpers/local-storage-helper';
import { Observable } from 'rxjs';
import { AppConfig, APP_CONFIG } from '../app.config';
import { CrudResponseModel } from '../models/crud-response-model';
import { DataProviderInterface } from '../interfaces/data-provider-interface';
import { q } from '../models/business-rules/business-rule-query.model';
import { FormGroup } from '@angular/forms';
import { CleanQueryHelper } from "../helpers/clean-query-helper";
import { HelperService } from 'src/app/api-services/helper.service';

@Injectable({
  providedIn: 'root'
})
export class AbstractDataProviderService <T> implements DataProviderInterface<T>{
  protected baseUrl: string;
  protected getHeaders: HttpHeaders;
  protected postHeaders: HttpHeaders;
  constructor( endpointName: string,
               protected uriSection: string,
               protected http: HttpClient,
               protected localStorageHelper: LocalStorageHelper,
               private helperService?: HelperService,
               @Inject(APP_CONFIG) protected appConfig?: AppConfig, ) {
                if (this.appConfig !== null) {
 // Check whether the endpoint name exists in the endpoint dictionary.
                  if (endpointName in this.appConfig.endpoints) {
                    const endpoint = this.appConfig.endpoints[endpointName];
                    this.baseUrl = endpoint + this.uriSection;
                  } else {
                    console.error('Invalid endpoint name passed to data provider.');
                  }
                } else {
                  // If appConfig was not injected, log an error.
                  console.error('A reference to an instance of AppConfig was not injected into this service.');
                }
              }

  /**
   * Builds a set of HTTP headers to send whenever a GET or DELETE request is issued.
   */
  protected buildGetHeaders(): HttpHeaders {
    let getHeaders = new HttpHeaders();
    const user =  this.localStorageHelper.getLoggedUserInfo();
    getHeaders = getHeaders.set('Authorization', 'Bearer ' + user.Token.access_token);
    return getHeaders;
  }


  /**
   * Builds a set of HTTP headers to send whenever a POST, PUT or PATCH request is issued.
   */
  protected buildPostHeaders(): HttpHeaders {
    const user =  this.localStorageHelper.getLoggedUserInfo();
    let postHeaders = new HttpHeaders();
    postHeaders = postHeaders.set('Authorization', 'Bearer ' + user.Token.access_token);
    postHeaders = postHeaders.set('Content-Type', 'application/json');
    return postHeaders;
  }

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.baseUrl + '/GetAll', { headers: this.buildGetHeaders() });
  }

  getAllComplete(): Observable<T[]> {
    return this.http.get<T[]>(this.baseUrl, { headers: this.buildGetHeaders() });
  }

  listaSelAll(startRowIndex: number, maximumRows: number, where: string = '', order: string = ''): Observable<T> {
    where = encodeURIComponent(where);
    order = encodeURIComponent(order);
    return this.http.get<T>(this.baseUrl + '/ListaSelAll?startRowIndex=' + startRowIndex + '&maximumRows=' + maximumRows +
    (where !=='' ? "&where=" + where : '') + (order !== '' ? "&order=" + order : '')
    , { headers: this.buildGetHeaders() });
  }

  getById(id: number): Observable<T> {
    const queryString = '/Get?id=' + id.toString();
    return this.http.get<T>(this.baseUrl + queryString, { headers: this.buildGetHeaders() });
  }

  insert(entity: T): Observable<number> {
    return this.http.post<number>(this.baseUrl + '/Post', entity, { headers: this.buildPostHeaders() });
  }

  update(id: number, entity: T): Observable<number> {
    return this.http.put<null>(this.baseUrl + '/Put?id=' + id.toString(), entity, { headers: this.buildPostHeaders() });
  }

  delete(id: number): Observable<null> {
    return this.http.delete<null>(this.baseUrl + '/Delete?id=' + id.toString(), { headers: this.buildGetHeaders() });
  }

  updateString(id: string, entity: T): Observable<string> {
    return this.http.put<any>(this.baseUrl + '/Put?id=' + id, entity, { headers: this.buildPostHeaders() });
  }

  deleteString(id: string): Observable<null> {
    return this.http.delete<null>(this.baseUrl + '/Delete?id=' + id, { headers: this.buildGetHeaders() });
  }

  GetExecuteQuery( query:string,  id:number,  securityCode:string): Observable<T> {
    const queryString = `Get?query=${query}&id=${id}&securityCode=${securityCode}`;
    return this.http.get<T>(this.baseUrl + queryString, { headers: this.buildGetHeaders() });
  }

  GetTable( query:string,  id:number,  securityCode:string): Observable<T> {
    const queryString = `/GetTable?query=${query}&id=${id}&securityCode=${securityCode}`;
    return this.http.get<T>(this.baseUrl + queryString, { headers: this.buildGetHeaders() });
  }

  ExecuteQuery(entity: T): Observable<T> {
    return this.http.post<T>(this.baseUrl + '/Post', entity, { headers: this.buildPostHeaders() });
  }

  SetValueExecuteQuery(formGroup: FormGroup, controlName:string, Query:string, Id:number, SecurityCode:string ) {

    const model: q = new q();
    model.id = Id;
    model.query = Query;
    model.securityCode = SecurityCode;

    Query = CleanQueryHelper.cleanQuery(Query);

    this.http.post<T>(this.baseUrl + '/Post', model, { headers: this.buildPostHeaders() }).subscribe((result) => { formGroup.get(controlName).setValue(result) });
  }

  SetValueExecuteQueryFG(Query:string, Id:number, SecurityCode:string ) {

    const model: q = new q();
    model.id = Id;
    model.query = Query;
    model.securityCode = SecurityCode;

    Query = CleanQueryHelper.cleanQuery(Query);

    this.http.post<T>(this.baseUrl + '/Post', model, { headers: this.buildPostHeaders() }).subscribe((result) => {});
  }

  SetValueExecuteQueryRT(Query:string, Id:number, SecurityCode:string ): string {

    const model: q = new q();
    model.id = Id;
    model.query = Query;
    model.securityCode = SecurityCode;

    Query = CleanQueryHelper.cleanQuery(Query);

    try{
      this.http.post<T>(this.baseUrl + '/Post', model, { headers: this.buildPostHeaders() }).subscribe((result) => {return result});
    }
    catch(ex){
      return ex;
    }
  }

  SendEmailQuery(Query:string, Id:number, SecurityCode:string, Subject:string, body:string ): string {

    const model: q = new q();
    model.id = Id;
    model.query = Query;
    model.securityCode = SecurityCode;

    Query = CleanQueryHelper.cleanQuery(Query);

    try{
      this.http.post<string>(this.baseUrl + '/Post', model, { headers: this.buildPostHeaders() }).subscribe((result) => 
      {
        
        this.helperService.SendEmailAngular(result,Subject,body).subscribe();
        return "True"
      });
    }
    catch(ex){
      return "False";
    }
  }

  GetRawQuery(entity: T): Observable<T> {
    return this.http.post<T>(this.baseUrl + '/GetRawQuery', entity, { headers: this.buildPostHeaders() });
  }
  
  ExecuteQueryDictionary(entity: T): Observable<T> {
    return this.http.post<T>(this.baseUrl + '/GetDictionary', entity, { headers: this.buildPostHeaders() });
  }

  GetRawQuery2(entity: T): Observable<T> {
    return this.http.post<T>(this.baseUrl + '/GetRawQuery2', entity, { headers: this.buildPostHeaders() });
  }

  GetEnumerable(entity: T): Observable<T> {
    return this.http.post<T>(this.baseUrl + '/GetEnumerable', entity, { headers: this.buildPostHeaders() });
  }

  GetJsonQuery(entity: T): Observable<T> {
    return this.http.post<T>(this.baseUrl + '/GetJsonQuery', entity, { headers: this.buildPostHeaders() });
  }
  

}
