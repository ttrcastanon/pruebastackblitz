import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Tipo_de_urgencia  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    @FormField('Urgencia', [''])
    Urgencia = '';

     @FormField('Tipo_de_urgencias', [''])
     Tipo_de_urgencias: Tipo_de_urgencia[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

