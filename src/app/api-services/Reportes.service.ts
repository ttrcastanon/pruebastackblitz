import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Byte } from "@angular/compiler/src/util";
import { Inject, Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { AppConfig, APP_CONFIG } from "../app.config";
import { LocalStorageHelper } from "../helpers/local-storage-helper";
import * as AppConstants from '../app-constants';

@Injectable({
  providedIn: "root",
})
export class ReportesService {

  endpointCloudPDF = AppConstants.EndpointNames.CloudPDF
  protected cloudPdfUrl: string;
  private readonly DirectoryImg: string = ""

  constructor(
    protected http: HttpClient,
    protected localStorageHelper: LocalStorageHelper,
    @Inject(APP_CONFIG) protected appConfig?: AppConfig
  ) {    
    if (this.appConfig !== null) {
      if (this.endpointCloudPDF in this.appConfig.endpoints) {
        const endpoint = this.appConfig.endpoints[this.endpointCloudPDF];
        this.cloudPdfUrl = endpoint + '/api';
        this.DirectoryImg = this.cloudPdfUrl + '/Spartan_File/Files/'
      }
    }
  }

  protected buildGetHeaders(): HttpHeaders {
    let getHeaders = new HttpHeaders();
    getHeaders = getHeaders.set('app-key', 'hjfsdnkjcv8u=njdhjsd==');
    getHeaders = getHeaders.set('app-code', '001');
    getHeaders = getHeaders.set('origen', 'http://localhost:12699/');

    const user = this.localStorageHelper.getLoggedUserInfo();
    getHeaders = getHeaders.set('Id_User', user.UserId.toString());
    getHeaders = getHeaders.set('Authorization', 'Bearer ' + user.Token.access_token);
    getHeaders = getHeaders.set('Content-Type', 'application/json');
    getHeaders = getHeaders.set('generapdf_cloud_service', 'true');


    return getHeaders;
  }

  public exportPDF(idReport: string, filtros: string, filtrosAvanzados: string = '') {
    return this.http.get<string>(this.cloudPdfUrl + '/PDF/GeneratePDFHtml?idReport=' + idReport + '&filtros=' + filtros + '&filtrosAvanzados=' + filtrosAvanzados + '&ImgDirectory=' + this.DirectoryImg, { headers: this.buildGetHeaders() });
  }

  public exportExcel(idReport: string, filtros: Record<"PhysicalName" | "Valor", string>[]) {
    return this.http.post(environment.endpoints.WebApi + 'api/Report/DetailedReport2', {
      datos: {
        id: idReport,
        filters: filtros,
        type: ''
      }
    });
  }

  public GeneratePDF(idFormat: number, RecordId: any) {

    return this.http.get<any>(this.cloudPdfUrl + '/PDF/GeneratePDF?idFormat=' + idFormat + '&RecordId=' + RecordId + '&ImgDirectory=' + this.DirectoryImg,
      { headers: this.buildGetHeaders() });
  }

}
