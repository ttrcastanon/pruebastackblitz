import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Spartan_User } from './Spartan_User';
import { Creacion_de_Proveedores } from './Creacion_de_Proveedores';
import { Solicitud_de_Vuelo } from './Solicitud_de_Vuelo';
import { Registro_de_vuelo } from './Registro_de_vuelo';
import { Estatus_de_Solicitud_de_Compras } from './Estatus_de_Solicitud_de_Compras';
import { Tipo_de_Solicitud_de_Compras } from './Tipo_de_Solicitud_de_Compras';
import { Detalle_de_Item_Servicios } from './Detalle_de_Item_Servicios';


export class Solicitud_de_Servicios_para_Operaciones  extends BaseView {
    @FormField('No_de_Solicitud', [0])
    No_de_Solicitud = 0;
    @FormField('Fecha_de_Registro', [''])
    Fecha_de_Registro = '';
    @FormField('Hora_de_Registro', [''])
    Hora_de_Registro = '';
    @FormField('Usuario_que_Registra', [''])
    Usuario_que_Registra = null;
    Usuario_que_Registra_Spartan_User: Spartan_User;
    @FormField('Proveedor', [''])
    Proveedor = null;
    Proveedor_Creacion_de_Proveedores: Creacion_de_Proveedores;
    @FormField('No__de_Vuelo', [''])
    No__de_Vuelo = null;
    No__de_Vuelo_Solicitud_de_Vuelo: Solicitud_de_Vuelo;
    @FormField('Tramo', [''])
    Tramo = null;
    Tramo_Registro_de_vuelo: Registro_de_vuelo;
    @FormField('Observaciones', [''])
    Observaciones = '';
    @FormField('Estatus', [''])
    Estatus = null;
    Estatus_Estatus_de_Solicitud_de_Compras: Estatus_de_Solicitud_de_Compras;
    @FormField('Tipo', [''])
    Tipo = null;
    Tipo_Tipo_de_Solicitud_de_Compras: Tipo_de_Solicitud_de_Compras;
    @FormField('Detalle_de_Item_ServiciosItems', [], Detalle_de_Item_Servicios,  true)
    Detalle_de_Item_ServiciosItems: FormArray;

    @FormField('No_Solicitud', [''])
    No_Solicitud = '';

     @FormField('Solicitud_de_Servicios_para_Operacioness', [''])
     Solicitud_de_Servicios_para_Operacioness: Solicitud_de_Servicios_para_Operaciones[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

