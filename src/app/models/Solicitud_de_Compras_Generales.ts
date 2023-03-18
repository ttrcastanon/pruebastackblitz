import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Spartan_User } from './Spartan_User';
import { Creacion_de_Proveedores } from './Creacion_de_Proveedores';
import { Solicitud_de_Vuelo } from './Solicitud_de_Vuelo';
import { Aeropuertos } from './Aeropuertos';
import { Orden_de_servicio } from './Orden_de_servicio';
import { Orden_de_Trabajo } from './Orden_de_Trabajo';
import { Departamento } from './Departamento';
import { Tipo_de_Solicitud_de_Compras } from './Tipo_de_Solicitud_de_Compras';
import { Estatus_de_Solicitud_de_Compras_Generales } from './Estatus_de_Solicitud_de_Compras_Generales';
import { Detalle_de_Item_Compras_Generales } from './Detalle_de_Item_Compras_Generales';
import { Autorizacion } from './Autorizacion';


export class Solicitud_de_Compras_Generales  extends BaseView {
    @FormField('No_de_Solicitud', [0])
    No_de_Solicitud = 0;
    @FormField('Fecha_de_Registro', [''])
    Fecha_de_Registro = '';
    @FormField('Hora_de_Registro', [''])
    Hora_de_Registro = '';
    @FormField('Usuario_que_Registra', [''])
    Usuario_que_Registra = null;
    Usuario_que_Registra_Spartan_User: Spartan_User;
    @FormField('Razon_de_la_Compra', [''])
    Razon_de_la_Compra = '';
    @FormField('Proveedor', [''])
    Proveedor = null;
    Proveedor_Creacion_de_Proveedores: Creacion_de_Proveedores;
    @FormField('No_de_Vuelo', [''])
    No_de_Vuelo = null;
    No_de_Vuelo_Solicitud_de_Vuelo: Solicitud_de_Vuelo;
    @FormField('Tramo', [''])
    Tramo = null;
    Tramo_Aeropuertos: Aeropuertos;
    @FormField('Numero_de_O_S', [''])
    Numero_de_O_S = null;
    Numero_de_O_S_Orden_de_servicio: Orden_de_servicio;
    @FormField('Numero_de_O_T', [''])
    Numero_de_O_T = null;
    Numero_de_O_T_Orden_de_Trabajo: Orden_de_Trabajo;
    @FormField('Departamento', [''])
    Departamento = null;
    Departamento_Departamento: Departamento;
    @FormField('Tipo', [''])
    Tipo = null;
    Tipo_Tipo_de_Solicitud_de_Compras: Tipo_de_Solicitud_de_Compras;
    @FormField('Observaciones', [''])
    Observaciones = '';
    @FormField('Motivo_de_Cancelacion', [''])
    Motivo_de_Cancelacion = '';
    @FormField('Enviar_Solicitud', [false])
    Enviar_Solicitud = false;
    @FormField('Estatus_de_Solicitud', [''])
    Estatus_de_Solicitud = null;
    Estatus_de_Solicitud_Estatus_de_Solicitud_de_Compras_Generales: Estatus_de_Solicitud_de_Compras_Generales;
    @FormField('Detalle_de_Item_Compras_GeneralesItems', [], Detalle_de_Item_Compras_Generales,  true)
    Detalle_de_Item_Compras_GeneralesItems: FormArray;

    @FormField('Fecha_de_Autorizacion', [''])
    Fecha_de_Autorizacion = '';
    @FormField('Hora_de_Autorizacion', [''])
    Hora_de_Autorizacion = '';
    @FormField('Autorizado_por', [''])
    Autorizado_por = null;
    Autorizado_por_Spartan_User: Spartan_User;
    @FormField('Resultado', [''])
    Resultado = null;
    Resultado_Autorizacion: Autorizacion;
    @FormField('Observacion', [''])
    Observacion = '';

     @FormField('Solicitud_de_Compras_Generaless', [''])
     Solicitud_de_Compras_Generaless: Solicitud_de_Compras_Generales[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

