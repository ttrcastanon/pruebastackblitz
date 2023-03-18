import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Estatus_de_Confirmacion } from './Estatus_de_Confirmacion';


export class Detalle_Coord_Documentacion_Aeronave  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Coordinacion_Documentacion = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';
    @FormField('Confirmado', [''])
    Confirmado = null;
    Confirmado_Estatus_de_Confirmacion: Estatus_de_Confirmacion;

     @FormField('Detalle_Coord_Documentacion_Aeronaves', [''])
     Detalle_Coord_Documentacion_Aeronaves: Detalle_Coord_Documentacion_Aeronave[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

