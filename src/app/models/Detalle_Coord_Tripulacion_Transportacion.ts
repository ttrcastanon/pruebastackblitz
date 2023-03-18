import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Tipo_de_Transportacion } from './Tipo_de_Transportacion';
import { Estatus_de_Confirmacion } from './Estatus_de_Confirmacion';


export class Detalle_Coord_Tripulacion_Transportacion  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Coordinacion_Tripulacion = 0;
    @FormField('Transportacion', [''])
    Transportacion = null;
    Transportacion_Tipo_de_Transportacion: Tipo_de_Transportacion;
    @FormField('Especificaciones', [''])
    Especificaciones = '';
    @FormField('Proveedor', [''])
    Proveedor = '';
    @FormField('Telefono', [''])
    Telefono = '';
    @FormField('Numero_de_Confirmacion', [''])
    Numero_de_Confirmacion = '';
    @FormField('Confirmado', [''])
    Confirmado = null;
    Confirmado_Estatus_de_Confirmacion: Estatus_de_Confirmacion;

     @FormField('Detalle_Coord_Tripulacion_Transportacions', [''])
     Detalle_Coord_Tripulacion_Transportacions: Detalle_Coord_Tripulacion_Transportacion[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

