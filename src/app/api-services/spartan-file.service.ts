import { catchError, map } from 'rxjs/operators';
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Observable, throwError } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';
import { SpartanFile } from '../models/spartan-file';
import { environment } from 'src/environments/environment';
import { HelperService } from 'src/app/api-services/helper.service';


@Injectable({
  providedIn: 'root'
})
export class SpartanFileService extends AbstractDataProviderService<SpartanFile> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, 'api/Spartan_File', http, localStorageHelper, _HelperService  , appConfig);
  }

  public url(id:string,filename:string){
    if(environment.filesAzure) return `${environment.urlStorageAzure}api/Spartan_File/Files/${id}/${filename}`  
    return `${this.baseUrl}/Files/${id}/${filename}`; 
  }

  public urlPath(path:string){
    return `${this.baseUrl}/Files/${path}`; 
  }

  public urlId(id:any):Observable<string>{
    if(!id) return new Observable((observer) => observer.next('#'));
    return this.getById(id).pipe(
      map(
        (file:SpartanFile)=>{
          return `${this.baseUrl}/Files/${file.File_Id}/${file.Description}`;
        }
      )
    );
  }

  /**
   * Obtener la información de todos los archivos de la carpeta api/Spartan_File/Files
   */
  GetAll() {
    
    return this.http.get<any>(environment.endpoints.WebApi + 'api/spartan_file/' + 'GetAll', { headers: this.buildGetHeaders() }).
    pipe(
       map(response => {
         return response;
       }), 
       catchError( error => {
        //console.log('File_Error', error);
         return throwError( 'Something went wrong!' );
       })
    )

  }


}
