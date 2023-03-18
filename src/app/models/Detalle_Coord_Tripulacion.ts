import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Tripulacion } from './Tripulacion';
import { Estatus_de_Confirmacion } from './Estatus_de_Confirmacion';


export class Detalle_Coord_Tripulacion  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Coordinacion_Tripulacion = 0;
    @FormField('_Tripulante', [''])
    _Tripulante = null;
    _Tripulante_Tripulacion: Tripulacion;
    @FormField('Comisariato', [''])
    Comisariato = '';
    @FormField('Fecha_de_Solicitud', [''])
    Fecha_de_Solicitud = '';
    @FormField('No_Solicitud', [''])
    No_Solicitud = null;
    @FormField('Proveedor', [''])
    Proveedor = '';
    @FormField('Confirmado_por_Correo', [false])
    Confirmado_por_Correo = false;
    @FormField('Confirmado_por_Telefono', [false])
    Confirmado_por_Telefono = false;
    @FormField('Confirmado', [''])
    Confirmado = null;
    Confirmado_Estatus_de_Confirmacion: Estatus_de_Confirmacion;

     @FormField('Detalle_Coord_Tripulacions', [''])
     Detalle_Coord_Tripulacions: Detalle_Coord_Tripulacion[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

