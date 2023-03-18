import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Departamento  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Nombre', [''])
    Nombre = '';

     @FormField('Departamentos', [''])
     Departamentos: Departamento[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

