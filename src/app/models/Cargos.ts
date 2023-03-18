import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Cargos  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';
    @FormField('Role_ID', [0])
    Role_ID = null;

     @FormField('Cargoss', [''])
     Cargoss: Cargos[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

