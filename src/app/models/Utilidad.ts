import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Utilidad  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';
    @FormField('Valor', [0])
    Valor = null;

     @FormField('Utilidads', [''])
     Utilidads: Utilidad[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

