import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { map } from 'rxjs/operators';
import { Injectable, Inject } from "@angular/core";
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { LocalStorageHelper } from "../helpers/local-storage-helper";
import { AppConfig, APP_CONFIG } from "../app.config";
import * as AppConstants from '../app-constants';
import { Observable } from "rxjs";
import { ObjectPermission } from "../models/object-permission";
import { ObjectMenu } from "../models/object-menu.";
import { SpartanFile } from '../models/spartan-file';
import { SpartanAdditionalMenuModel } from 'src/app/models/spartan-aditional-menu.model';
import { environment } from 'src/environments/environment';
import { ObjectSubMenu } from '../models/object-sub-menu';
import { HttpUrlEncodingCodec } from '@angular/common/http';

@Injectable({
  providedIn: "root",
})
export class SeguridadService {
  protected baseUrl: string;
  protected getHeaders: HttpHeaders;
  protected postHeaders: HttpHeaders;
  codec = new HttpUrlEncodingCodec;
  constructor(
    protected http: HttpClient,
    protected localStorageHelper: LocalStorageHelper,
    protected _files: SpartanFileService,
    @Inject(APP_CONFIG) protected appConfig?: AppConfig
  ) {
    let endpointName = AppConstants.EndpointNames.WebApi;
    let uri = "api/Spartan_SecurityAccount";
    if (endpointName in this.appConfig.endpoints) {
      const endpoint = this.appConfig.endpoints[endpointName];
      this.baseUrl = endpoint + uri;
    } else {
      //throw new exception("Invalid endpoint name passed to data provider.");
    }
  }

  /**
   * Builds a set of HTTP headers to send whenever a GET or DELETE request is issued.
   */
  protected buildGetHeaders(): HttpHeaders {
    let getHeaders = new HttpHeaders();
    const user = this.localStorageHelper.getLoggedUserInfo();
    getHeaders = getHeaders.set(
      "Authorization",
      "Bearer " + user.Token.access_token
    );
    return getHeaders;
  }

  /**
   * Builds a set of HTTP headers to send whenever a POST, PUT or PATCH request is issued.
   */
  protected buildPostHeaders(): HttpHeaders {
    const user = this.localStorageHelper.getLoggedUserInfo();
    let postHeaders = new HttpHeaders();
    postHeaders = postHeaders.set(
      "Authorization",
      "Bearer " + user.Token.access_token
    );
    postHeaders = postHeaders.set("Content-Type", "application/json");
    return postHeaders;
  }

  public logout() {
    this.localStorageHelper.setLoggedUserInfo(null);
  }

  public permisos(view): Observable<ObjectPermission[]> {
    const user = this.localStorageHelper.getLoggedUserInfo();
    return this.http.get<ObjectPermission[]>(this.baseUrl + "/GetObjectPermissions?ObjectId=" + view + "&RoleId=" + user.RoleId, {
      headers: this.buildGetHeaders()
    });
  }

  public menu(): Observable<ObjectMenu[]> {
    const user = this.localStorageHelper.getLoggedUserInfo();
    return this.http.get<ObjectMenu[]>(`${this.baseUrl}/GetMenu?RoleId=${user.RoleId}`, {
      headers: this.buildGetHeaders()
    })
      .pipe(map((resp: ObjectMenu[]) => {

        let transform: ObjectMenu[] = [];

        resp.forEach((itm) => {
          if (transform.filter((t) => t.moduleid == itm.moduleid).length == 0) {
            // itm.moduleicon = this._files.urlPath(itm.moduleicon);
            itm.objecticon = this._files.urlPath(itm.objecticon);
            const m = new ObjectMenu(itm, true);
            m.submenu.push(new ObjectMenu(itm));

            if (itm.objectid > 0) {

              this.GetAdditionalMenu(itm.objectid.toString(), user)
                .subscribe((response: ObjectSubMenu[]) => {
                  response.forEach((ItemSubMenu) => {
                    m.submenu.forEach((item) => {

                      if (item.path == "Seguimiento_de_Solicitud_de_Compras/list") {
                        item.path = "Seguimiento_de_Solicitud_de_Compras/add";
                      }
                      if (item.path == "Seguimiento_de_Solicitud_de_Compras/cancel/list") {
                        item.path = "Seguimiento_de_Solicitud_de_Compras/cancel";
                      }
                      if (item.path == "Gestion_de_aprobacion/list") {
                        item.path = "Gestion_de_aprobacion/add";
                      }
                      if (item.path == "Listado_de_Pago_de_Proveedores/list") {
                        item.path = "Listado_de_Pago_de_Proveedores/add";
                      }

                      if (item.objectid == +ItemSubMenu.MenuName) {
                        if (ItemSubMenu.OptionPath.includes("DynamicSearch")) {
                          ItemSubMenu.OptionPath = "DynamicSearch/" + ItemSubMenu.OptionPath
                        }
                        else {
                          ItemSubMenu.OptionPath = item.path + ItemSubMenu.OptionPath;
                        }
                        //Crear reporte OT optional path
                        if (ItemSubMenu.OptionPath == "Orden_de_Trabajo/list/1") {
                          ItemSubMenu.OptionPath = "Orden_de_Trabajo/add";
                        }
                        if (ItemSubMenu.OptionPath == "Crear_Reporte/list/1") {
                          ItemSubMenu.OptionPath = "Crear_Reporte/add";
                        }
                        if (ItemSubMenu.OptionPath == "Seguimiento_de_Solicitud_de_Compras/list") {
                          ItemSubMenu.OptionPath = "Seguimiento_de_Solicitud_de_Compras/add";
                        }

                        item.ObjectSubMenu.push(ItemSubMenu);
                      }
                    })
                  });

                });
            }
            transform.push(m);
          }
          else {
            const m = transform.filter((t) => t.moduleid == itm.moduleid)[0];
            // itm.moduleicon = this._files.urlPath(itm.moduleicon); 
            itm.objecticon = this._files.urlPath(itm.objecticon);
            const itmObj = new ObjectMenu(itm);
            m.submenu.push(itmObj);
            if (itm.objectid > 0) {
              this.GetAdditionalMenu(itm.objectid.toString(), user)
                .subscribe((response: ObjectSubMenu[]) => {
                  response.forEach((ItemSubMenu) => {
                    m.submenu.forEach((item) => {

                      if (item.path == "Seguimiento_de_Solicitud_de_Compras/list") {
                        item.path = "Seguimiento_de_Solicitud_de_Compras/add";
                      }

                      if (item.path == "Seguimiento_de_Solicitud_de_Compras/cancel/list") {
                        item.path = "Seguimiento_de_Solicitud_de_Compras/cancel";
                      }

                      if (item.path == "Gestion_de_aprobacion/list") {
                        item.path = "Gestion_de_aprobacion/add";
                      }
                      if (item.path == "Listado_de_Pago_de_Proveedores/list") {
                        item.path = "Listado_de_Pago_de_Proveedores/add";
                      }

                      if (item.objectid == +ItemSubMenu.MenuName) {
                        if (ItemSubMenu.OptionPath.includes("DynamicSearch")) {
                          ItemSubMenu.OptionPath = "DynamicSearch/" + ItemSubMenu.OptionPath
                        }
                        else {
                          ItemSubMenu.OptionPath = item.path + ItemSubMenu.OptionPath;
                        }
                        //Crear reporte OT optional path
                        if (ItemSubMenu.OptionPath == "Orden_de_Trabajo/list/1") {
                          ItemSubMenu.OptionPath = "Orden_de_Trabajo/add";
                        }
                        if (ItemSubMenu.OptionPath == "Crear_Reporte/list/1") {
                          ItemSubMenu.OptionPath = "Crear_Reporte/add";
                        }

                        item.ObjectSubMenu.push(ItemSubMenu);

                      }
                    })
                  });

                });
            }
          }
        });
        //console.log('menu', transform);
        return transform;
      }));
  }

  /**
   * Obteniendo los cantadores de Charolas(Badge)
   * @param objectId 
   * @param user 
   */
  GetAdditionalMenu(objectId: string, user: any) {
    const apiURL = environment.endpoints.WebApi + '/api/SpartanAdditionalMenu/';
    let newUser = objectId + user.UserId;
    return this.http.get<SpartanAdditionalMenuModel[]>(apiURL + "GetMenu?user=" + newUser + "&languageId=" + 2, {
      headers: this.buildGetHeaders()
    });
  }

  GetAdditionalMenuJSON(): Observable<SpartanAdditionalMenuModel[]> {
    return this.http.get<SpartanAdditionalMenuModel[]>('assets/data/dataAdditionalMenu.json');
  }

  // ToDo: evaluate if we can remove it (is not used)
  // AddDummyOptionMenu() {
  //   return [
  //     {
  //       "Id":0,
  //       "badge":"",
  //       "badgeClass":"",
  //       "class":"menu-toggle",
  //       "icon":"http://192.168.0.9:45455/api/Spartan_File/Files/11/Blank-Catalog.png",
  //       "iconType":"material-icons-two-tone",
  //       "isModule":true,
  //       "moduleicon":"http://192.168.0.9:45455/api/Spartan_File/Files/11/Blank-Catalog.png",
  //       "moduleid":52,
  //       "modulename":"Opción Dummy",
  //       "moduleorder":1,
  //       "objecticon":"http://192.168.0.9:45455/api/Spartan_File/Files/11/Blank-Catalog.png",
  //       "objectid":44871,
  //       "objectname":"Area",
  //       "objectorder":0,
  //       "objecturl":"Area",
  //       "path":"view/Area/list",
  //       "submenu":[
  //          {
  //             "Id":0,
  //             "badge":"4",
  //             "badgeClass":"",
  //             "class":"",
  //             "icon":"http://192.168.0.9:45455/api/Spartan_File/Files/11/Blank-Catalog.png",
  //             "iconType":"material-icons-two-tone",
  //             "isModule":false,
  //             "moduleicon":"http://192.168.0.9:45455/api/Spartan_File/Files/11/Blank-Catalog.png",
  //             "moduleid":52,
  //             "modulename":"Opción Dummy",
  //             "moduleorder":1,
  //             "objecticon":"http://192.168.0.9:45455/api/Spartan_File/Files/11/Blank-Catalog.png",
  //             "objectid":44871,
  //             "objectname":"Area",
  //             "objectorder":0,
  //             "objecturl":"Area",
  //             "path":"view/Area/list",
  //             "submenu":[ ],
  //             "title":"menu.object.99991"
  //          },
  //          {
  //             "Id":0,
  //             "badge":"4",
  //             "badgeClass":"",
  //             "class":"",
  //             "icon":"http://192.168.0.9:45455/api/Spartan_File/Files/11/Blank-Catalog.png",
  //             "iconType":"material-icons-two-tone",
  //             "isModule":false,
  //             "moduleicon":"http://192.168.0.9:45455/api/Spartan_File/Files/11/Blank-Catalog.png",
  //             "moduleid":52,
  //             "modulename":"Opción Dummy",
  //             "moduleorder":1,
  //             "objecticon":"http://192.168.0.9:45455/api/Spartan_File/Files/11/Blank-Catalog.png",
  //             "objectid":44872,
  //             "objectname":"Cargo",
  //             "objectorder":0,
  //             "objecturl":"Cargo",
  //             "path":"security/permissions",
  //             "submenu":[],
  //             "title":"menu.object.99992"
  //          },
  //          {
  //           "Id": 0,
  //           "badge": "4",
  //           "badgeClass": "",
  //           "class": "",
  //           "icon": "http://192.168.0.9:45455/api/Spartan_File/Files/11/Blank-Catalog.png",
  //           "iconType": "material-icons-two-tone",
  //           "isModule": false,
  //           "moduleicon": "http://192.168.0.9:45455/api/Spartan_File/Files/11/Blank-Catalog.png",
  //           "moduleid": 52,
  //           "modulename": "Opción Dummy",
  //           "moduleorder": 1,
  //           "objecticon": "http://192.168.0.9:45455/api/Spartan_File/Files/11/Blank-Catalog.png",
  //           "objectid": 44870,
  //           "objectname": "Departamento",
  //           "objectorder": 0,
  //           "objecturl": "Departamento",
  //           "path": "view/Departamento/list",
  //           "submenu": [],
  //           "title": "menu.object.99993"
  //          }
  //       ],
  //       "title":"menu.object.52"
  //    }
  // ]
  // }

  // ToDo: evaluate if we can remove it (is not used)
  // AddDumyAdditionalMenu() {
  //   return [
  //     {
  //         "idMenu": 104,
  //         "MenuName": "45004",
  //         "ParentMenu": 0,
  //         "OptionMenu": "Nueva Atención Inicial",
  //         "OptionPath": "WFSend?Phase=1&Name=Nueva Atención Inicial&Page=Modulo_Atencion_Inicial_Create"
  //     },
  //     {
  //         "idMenu": 105,
  //         "MenuName": "45004",
  //         "ParentMenu": 25,
  //         "OptionMenu": "Orientador",
  //         "OptionPath": "DynamicSearch?id=2&wf=3&p=2"
  //     },
  //     {
  //         "idMenu": 108,
  //         "MenuName": "45004",
  //         "ParentMenu": 1,
  //         "OptionMenu": "Validación de Acuerdo",
  //         "OptionPath": "DynamicSearch?id=2&wf=3&p=5"
  //     },
  //     {
  //         "idMenu": 109,
  //         "MenuName": "45004",
  //         "ParentMenu": 0,
  //         "OptionMenu": "En Validación",
  //         "OptionPath": "DynamicSearch?id=2&wf=3&p=6"
  //     },
  //     {
  //         "idMenu": 110,
  //         "MenuName": "45004",
  //         "ParentMenu": 98,
  //         "OptionMenu": "Canalizados",
  //         "OptionPath": "DynamicSearch?id=2&wf=3&p=7"
  //     },
  //     {
  //         "idMenu": 112,
  //         "MenuName": "45004",
  //         "ParentMenu": 0,
  //         "OptionMenu": "Acuerdos Cumplidos",
  //         "OptionPath": "DynamicSearch?id=2&wf=3&p=9"
  //     },
  //     {
  //         "idMenu": 113,
  //         "MenuName": "45004",
  //         "ParentMenu": 14,
  //         "OptionMenu": "Cerrados",
  //         "OptionPath": "DynamicSearch?id=2&wf=3&p=10"
  //     },
  //     {
  //         "idMenu": 114,
  //         "MenuName": "45004",
  //         "ParentMenu": 0,
  //         "OptionMenu": "Expedientes Temporales",
  //         "OptionPath": "DynamicSearch?id=2&wf=3&p=11"
  //     }
  // ]
  // }

}
