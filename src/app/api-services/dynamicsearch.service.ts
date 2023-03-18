import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataToShow, Detail  } from '../models/datatoshow.model';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders  } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { LocalStorageHelper } from '../helpers/local-storage-helper';
import { environment } from 'src/environments/environment';
import { DynamicSearch } from '../models/dynamicsearch.model';
import { Resultsearchtable } from '../models/resultsearchtable.model';
import { SearchField } from '../models/searchfield.model';

@Injectable({
  providedIn: 'root'
})
export class DynamicSearchService 
// extends AbstractDataProviderService<DynamicSearch> 

{
  private readonly API_URL_DATA_TO_SHOW = 'api/DynamicSearch/GetDataToShow/';
  private readonly API_URL_RESULT_SEARCH_TABLE = 'api/DynamicSearch/ResultSearchTable';
  private readonly API_URL_SEARCH_FIELDS = 'api/DynamicSearch/GetSearchFields/';
  private readonly API_URL_DETALLE_BY_SEARCH_RESULT = 'api/DynamicSearch/GetDetalleBySearchResult/';

  dataChange: BehaviorSubject<DynamicSearch[]> = new BehaviorSubject<DynamicSearch[]>(
    []
  );
  dataChangeDataToShow: BehaviorSubject<DataToShow[]> = new BehaviorSubject<DataToShow[]>(
    []
  );
  dataChangeResultsearchtable: BehaviorSubject<Resultsearchtable[]> = new BehaviorSubject<Resultsearchtable[]>(
    []
  );
  dataChangeSearchField: BehaviorSubject<SearchField[]> = new BehaviorSubject<SearchField[]>(
    []
  );

  dialogData: any;
  // constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
  //   super(AppConstants.EndpointNames.WebApi, 'api/Detalle_Cargos_de_Empleado', http, localStorageHelper, _HelperService  , appConfig);
  // }
  constructor(private http: HttpClient) {

  }

  get data(): DynamicSearch[] {
    return this.dataChange.value;
  }
  get dataDataToShow(): DataToShow[] {
    return this.dataChangeDataToShow.value;
  }

  get dataSearchField(): SearchField[] {
    return this.dataChangeSearchField .value;
  }
  get dataResultsearchtable(): Resultsearchtable[] {
    return this.dataChangeResultsearchtable.value;
  }


  getDialogData() {
    return this.dialogData;
  }
  getDataToShowI(id: number, idTablero: string) {
    return this.http.post(environment.endpoints.WebApi + this.API_URL_DATA_TO_SHOW, { id, idTablero }).
    pipe(
       map((data: DataToShow) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
   }
   



  getResultSearchTableI(id, resultsSearch : SearchField[]) {
    // let Data={"data":resultsSearch}
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }
    
    //console.log(JSON.stringify(resultsSearch)); 
    return this.http.post(environment.endpoints.WebApi + this.API_URL_RESULT_SEARCH_TABLE + '/' + id, JSON.stringify(resultsSearch) , httpOptions ).
    pipe(
       map((data: Resultsearchtable) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
   }
   
  getSearchFieldsI(idTablero: string) {
    return this.http.post(environment.endpoints.WebApi + this.API_URL_SEARCH_FIELDS, { idTablero }).
    pipe(
       map((data: SearchField[]) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
   }

   getDetalleBySearchResultI(id: string, idTablero: number,  idTab: string) {
    return this.http.post(environment.endpoints.WebApi + this.API_URL_DETALLE_BY_SEARCH_RESULT, { id, idTablero, idTab }).
    pipe(
       map((data: Detail) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
   }
   
   
}

