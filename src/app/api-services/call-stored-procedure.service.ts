import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageHelper } from '../helpers/local-storage-helper';

@Injectable({
  providedIn: 'root'
})
export class CallStoredProcedureService {

  constructor(
    private http: HttpClient,
    protected localStorageHelper: LocalStorageHelper
  ) { }

  protected buildGetHeaders(): HttpHeaders {
    let getHeaders = new HttpHeaders();
    const user = this.localStorageHelper.getLoggedUserInfo();
    getHeaders = getHeaders.set('Authorization', 'Bearer ' + user.Token.access_token);
    return getHeaders;
  }


  uspGetAyudaTramitesRamo(filter: any) {
    return true;
  }
  uspGetDirectorioMedicos(filter: any) {
    return true;
  }
  uspGetDirectorioHospitales(filter: any) {
    return true;
  }

}
