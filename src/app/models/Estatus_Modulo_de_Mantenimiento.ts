import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Estatus_Modulo_de_Mantenimiento  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('Estatus_Modulo_de_Mantenimientos', [''])
     Estatus_Modulo_de_Mantenimientos: Estatus_Modulo_de_Mantenimiento[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

