import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Nivel_de_Ruido  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('Nivel_de_Ruidos', [''])
     Nivel_de_Ruidos: Nivel_de_Ruido[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

