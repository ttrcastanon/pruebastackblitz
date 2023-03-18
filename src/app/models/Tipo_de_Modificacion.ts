import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Ramo } from './Ramo';


export class Tipo_de_Modificacion  extends BaseView {
    @FormField('Clave', [0, Validators.required])
    Clave = 0;
    @FormField('Descripcion', ['', Validators.required])
    Descripcion = '';
    @FormField('Ramo', [''])
    Ramo = null;
    Ramo_Ramo: Ramo;

     @FormField('Tipo_de_Modificacions', [''])
     Tipo_de_Modificacions: Tipo_de_Modificacion[] = [];
        
}

