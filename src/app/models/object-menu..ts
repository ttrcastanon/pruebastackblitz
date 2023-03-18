import { ObjectSubMenu } from './object-sub-menu';
export class ObjectMenu {
    Id: number;
    moduleicon: string;
    moduleid: number;
    modulename: string;
    moduleorder: number;
    objecticon: string;
    objectid: number;
    objectname: string;
    objectorder: number;
    objecturl: string;

    submenu: ObjectMenu[];
    //extra fields to render on menu
    ObjectSubMenu: ObjectSubMenu[];
    isModule: boolean;
    path: string;
    subpath: string;
    title: string;
    icon: string;
    iconType: string;
    class: string;
    badge: string;
    badgeClass: string;
    loaded: boolean;
    //show: false;

    constructor(data: any, isModule: boolean = false) {
        {
            this.Id = data.id || 0;
            this.moduleicon = data.moduleicon || '';
            this.moduleid = data.moduleid || 0;
            this.modulename = data.modulename || '';
            this.moduleorder = data.moduleorder || 0;
            this.objecticon = data.objecticon || '';
            this.objectid = data.objectid || 0;
            this.objectname = data.objectname || '';
            this.objectorder = data.objectorder || 0;
            this.objecturl = data.objecturl || '';

            this.submenu = [];
            this.ObjectSubMenu = [];

            // Review 40: Checar forma en que se generan las rutas dinamicamente
            this.path = this.objecturl.includes("list") ? decodeURIComponent(`${this.objecturl}`) : decodeURIComponent(`${this.objecturl}/list`);

            if (this.objecturl.includes("Listado_de_compras_en_proceso")) {
                this.path = "Listado_de_compras_en_proceso/add";
            }
            if (this.objecturl.includes("Listado_de_compras_en_proceso_de_Exportacion")) {
                this.path = "Listado_de_compras_en_proceso_de_Exportacion/add";
            }
            if (this.objecturl.includes("Listado_de_compras_en_proceso_de_Importacion")) {
                this.path = "Listado_de_compras_en_proceso_de_Importacion/add";
            }
            if (this.objecturl.includes("Solicitud_de_partes_materiales_y_herramientas")) {
                this.path = "Solicitud_de_partes_materiales_y_herramientas/add";
            }

            if (decodeURIComponent(this.path).includes("?")) {
                this.subpath = "?" + this.path.split("?")[1];
                this.path = this.path.split("?")[0];
            }

            this.isModule = isModule;
            if (this.isModule) {
                this.title = 'menu.module.' + data.moduleid;
                this.icon = data.moduleicon;
                this.class = 'menu-toggle';
            } else {
                this.title = 'menu.object.' + data.objectid;;
                this.icon = data.objecticon;
                this.class = '';
            }
            this.badge = '';
            this.badgeClass = '';
            this.iconType = 'material-icons-two-tone';
        }
    }


}
