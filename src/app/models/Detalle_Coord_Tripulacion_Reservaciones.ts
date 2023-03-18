import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Tipo_de_Hospedaje } from './Tipo_de_Hospedaje';
import { Estatus_de_Confirmacion } from './Estatus_de_Confirmacion';


export class Detalle_Coord_Tripulacion_Reservaciones  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Coordinacion_Tripulacion = 0;
    @FormField('Hospedaje', [''])
    Hospedaje = null;
    Hospedaje_Tipo_de_Hospedaje: Tipo_de_Hospedaje;
    @FormField('Nombre_del_Hotel', [''])
    Nombre_del_Hotel = '';
    @FormField('Telefono', [''])
    Telefono = '';
    @FormField('Numero_de_Confirmacion', [''])
    Numero_de_Confirmacion = '';
    @FormField('Confirmado_por_Correo', [false])
    Confirmado_por_Correo = false;
    @FormField('Confirmado_por_Telefono', [false])
    Confirmado_por_Telefono = false;
    @FormField('Confirmado', [''])
    Confirmado = null;
    Confirmado_Estatus_de_Confirmacion: Estatus_de_Confirmacion;

     @FormField('Detalle_Coord_Tripulacion_Reservacioness', [''])
     Detalle_Coord_Tripulacion_Reservacioness: Detalle_Coord_Tripulacion_Reservaciones[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

