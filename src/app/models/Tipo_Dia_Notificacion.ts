import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Tipo_Dia_Notificacion  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('Tipo_Dia_Notificacions', [''])
     Tipo_Dia_Notificacions: Tipo_Dia_Notificacion[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

