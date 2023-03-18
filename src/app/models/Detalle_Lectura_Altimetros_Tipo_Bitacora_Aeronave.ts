import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Detalle_Lectura_Altimetros_Tipo_Bitacora_Aeronave  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Bitacora = 0;
    @FormField('Concepto', [''])
    Concepto = '';

     @FormField('Detalle_Lectura_Altimetros_Tipo_Bitacora_Aeronaves', [''])
     Detalle_Lectura_Altimetros_Tipo_Bitacora_Aeronaves: Detalle_Lectura_Altimetros_Tipo_Bitacora_Aeronave[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

