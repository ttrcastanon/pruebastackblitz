import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Pasajeros } from './Pasajeros';
import { Estatus_de_Confirmacion } from './Estatus_de_Confirmacion';


export class Detalle_Coordinacion_Paxs_Servicios  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Coordinacion_Pasajeros = 0;
    @FormField('Pasajero', [''])
    Pasajero = null;
    Pasajero_Pasajeros: Pasajeros;
    @FormField('Ruta', [''])
    Ruta = '';
    @FormField('Comisariato_C', [''])
    Comisariato_C = '';
    @FormField('Proveedor', [''])
    Proveedor = '';
    @FormField('Fecha_de_Solicitud', [''])
    Fecha_de_Solicitud = '';
    @FormField('Confirmado_por_Correo', [false])
    Confirmado_por_Correo = false;
    @FormField('Confirmado_por_Telefono', [false])
    Confirmado_por_Telefono = false;
    @FormField('Confirmado', [''])
    Confirmado = null;
    Confirmado_Estatus_de_Confirmacion: Estatus_de_Confirmacion;

     @FormField('Detalle_Coordinacion_Paxs_Servicioss', [''])
     Detalle_Coordinacion_Paxs_Servicioss: Detalle_Coordinacion_Paxs_Servicios[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

