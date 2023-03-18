import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Pais  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    @FormField('Nombre', [''])
    Nombre = '';
    @FormField('Nacionalidad', [''])
    Nacionalidad = '';
    @FormField('Abreviacion', [''])
    Abreviacion = '';

     @FormField('Paiss', [''])
     Paiss: Pais[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

