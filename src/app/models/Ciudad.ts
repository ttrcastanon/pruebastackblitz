import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Estado } from './Estado';


export class Ciudad  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    @FormField('Nombre', [''])
    Nombre = '';
    @FormField('Estado', [''])
    Estado = null;
    Estado_Estado: Estado;

     @FormField('Ciudads', [''])
     Ciudads: Ciudad[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

