import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Respuesta } from './Respuesta';


export class Modulos_reportes  extends BaseView {
    @FormField('Clave', [0, Validators.required])
    Clave = 0;
    @FormField('Nombre', ['', Validators.required])
    Nombre = '';
    @FormField('IDModulo', [''])
    IDModulo = null;
    IDModulo_Respuesta: Respuesta;

     @FormField('Modulos_reportess', [''])
     Modulos_reportess: Modulos_reportes[] = [];
        
}

