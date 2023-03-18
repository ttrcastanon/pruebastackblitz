import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Pais } from './Pais';


export class Estado  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    @FormField('Nombre', [''])
    Nombre = '';
    @FormField('Pais', [''])
    Pais = null;
    Pais_Pais: Pais;

     @FormField('Estados', [''])
     Estados: Estado[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

