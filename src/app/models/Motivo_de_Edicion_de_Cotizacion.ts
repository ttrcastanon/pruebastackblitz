import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Motivo_de_Edicion_de_Cotizacion  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('Motivo_de_Edicion_de_Cotizacions', [''])
     Motivo_de_Edicion_de_Cotizacions: Motivo_de_Edicion_de_Cotizacion[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

