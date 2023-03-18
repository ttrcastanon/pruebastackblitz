import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Creacion_de_Proveedores } from './Creacion_de_Proveedores';
import { Razon_de_Rechazo_a_Almacen } from './Razon_de_Rechazo_a_Almacen';


export class Notificacion_de_rechazo_al_ingreso_de_almacen  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('No__de_Parte___Descripcion', [''])
    No__de_Parte___Descripcion = '';
    @FormField('Proveedor', [''])
    Proveedor = null;
    Proveedor_Creacion_de_Proveedores: Creacion_de_Proveedores;
    @FormField('Razon', [''])
    Razon = null;
    Razon_Razon_de_Rechazo_a_Almacen: Razon_de_Rechazo_a_Almacen;
    @FormField('Motivo_de_devolucion', [''])
    Motivo_de_devolucion = '';
    @FormField('IdNotificacionRechazoIA', [''])
    IdNotificacionRechazoIA = '';

     @FormField('Notificacion_de_rechazo_al_ingreso_de_almacens', [''])
     Notificacion_de_rechazo_al_ingreso_de_almacens: Notificacion_de_rechazo_al_ingreso_de_almacen[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

