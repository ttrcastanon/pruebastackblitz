import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Folios_Generacion_OC } from './Folios_Generacion_OC';
import { Spartan_User } from './Spartan_User';
import { Creacion_de_Proveedores } from './Creacion_de_Proveedores';
import { Detalle_de_Generacion_de_OC } from './Detalle_de_Generacion_de_OC';
import { Moneda } from './Moneda';
import { Estatus_de_Seguimiento } from './Estatus_de_Seguimiento';
import { Tipo_de_Transporte } from './Tipo_de_Transporte';


export class Generacion_de_Orden_de_Compras  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('FolioCorreo', [''])
    FolioCorreo = null;
    FolioCorreo_Folios_Generacion_OC: Folios_Generacion_OC;
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
    @FormField('RFC', [''])
    RFC = null;
    RFC_Creacion_de_Proveedores: Creacion_de_Proveedores;
    @FormField('Vendedor', [''])
    Vendedor = null;
    Vendedor_Creacion_de_Proveedores: Creacion_de_Proveedores;
    @FormField('Direccion', [''])
    Direccion = null;
    Direccion_Creacion_de_Proveedores: Creacion_de_Proveedores;
    @FormField('Telefono_del_Contacto', [''])
    Telefono_del_Contacto = null;
    Telefono_del_Contacto_Creacion_de_Proveedores: Creacion_de_Proveedores;
    @FormField('Email', [''])
    Email = null;
    Email_Creacion_de_Proveedores: Creacion_de_Proveedores;
    @FormField('Detalle_de_Generacion_de_OCItems', [], Detalle_de_Generacion_de_OC,  true)
    Detalle_de_Generacion_de_OCItems: FormArray;

    @FormField('Subtotal', [''])
    Subtotal = null;
    @FormField('Total', [''])
    Total = null;
    @FormField('Moneda', [''])
    Moneda = null;
    Moneda_Moneda: Moneda;
    @FormField('Mensaje_de_correo', [''])
    Mensaje_de_correo = '';
    @FormField('Comentarios_Adicionales', [''])
    Comentarios_Adicionales = '';
    @FormField('Estatus_OC', [''])
    Estatus_OC = null;
    Estatus_OC_Estatus_de_Seguimiento: Estatus_de_Seguimiento;
    @FormField('Tipo_de_Envio', [''])
    Tipo_de_Envio = '';
    @FormField('Transporte', [''])
    Transporte = null;
    Transporte_Tipo_de_Transporte: Tipo_de_Transporte;
    @FormField('FolioGeneracionOC', [''])
    FolioGeneracionOC = '';

     @FormField('Generacion_de_Orden_de_Comprass', [''])
     Generacion_de_Orden_de_Comprass: Generacion_de_Orden_de_Compras[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

