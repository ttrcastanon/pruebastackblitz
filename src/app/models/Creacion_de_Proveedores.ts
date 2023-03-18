import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Estatus_de_Proveedor } from './Estatus_de_Proveedor';
import { Tipos_de_proveedor } from './Tipos_de_proveedor';
import { Respuesta } from './Respuesta';
import { Clasificacion_de_proveedores } from './Clasificacion_de_proveedores';


export class Creacion_de_Proveedores  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    @FormField('ID_Dynamics', [''])
    ID_Dynamics = '';
    @FormField('Razon_social', [''])
    Razon_social = '';
    @FormField('RFC', [''])
    RFC = '';
    @FormField('Contacto', [''])
    Contacto = '';
    @FormField('Correo_electronico', [''])
    Correo_electronico = '';
    @FormField('Direccion_fiscal', [''])
    Direccion_fiscal = '';
    @FormField('Direccion_postal', [''])
    Direccion_postal = '';
    @FormField('Telefono_de_contacto', [''])
    Telefono_de_contacto = '';
    @FormField('Estatus', [''])
    Estatus = null;
    Estatus_Estatus_de_Proveedor: Estatus_de_Proveedor;
    @FormField('Tiempo_de_pagos_negociado', [0])
    Tiempo_de_pagos_negociado = null;
    @FormField('Tipo_de_proveedor', [''])
    Tipo_de_proveedor = null;
    Tipo_de_proveedor_Tipos_de_proveedor: Tipos_de_proveedor;
    @FormField('Se_realizo_auditoria', [''])
    Se_realizo_auditoria = null;
    Se_realizo_auditoria_Respuesta: Respuesta;
    @FormField('Clasificacion_de_proveedor', [''])
    Clasificacion_de_proveedor = null;
    Clasificacion_de_proveedor_Clasificacion_de_proveedores: Clasificacion_de_proveedores;
    @FormField('Cargar_acuerdo', [''])
    Cargar_acuerdo = null;
    @FormField('Cargar_acuerdoFile', [''])
    Cargar_acuerdoFile: FileInput = null;

     @FormField('Creacion_de_Proveedoress', [''])
     Creacion_de_Proveedoress: Creacion_de_Proveedores[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

