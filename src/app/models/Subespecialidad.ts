import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Especialidad } from './Especialidad';


export class Subespecialidad  extends BaseView {
    @FormField('Clave', [0, Validators.required])
    Clave = 0;
    @FormField('Nombre', ['', Validators.required])
    Nombre = '';
    @FormField('Especialidad', [''])
    Especialidad = null;
    Especialidad_Especialidad: Especialidad;

     @FormField('Subespecialidads', [''])
     Subespecialidads: Subespecialidad[] = [];
        
}

