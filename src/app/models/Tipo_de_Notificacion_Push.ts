import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Tipo_de_Notificacion_Push  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('Tipo_de_Notificacion_Pushs', [''])
     Tipo_de_Notificacion_Pushs: Tipo_de_Notificacion_Push[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

