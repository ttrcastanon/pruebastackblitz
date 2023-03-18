import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Estatus_de_Cierre_de_Vuelo  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('Estatus_de_Cierre_de_Vuelos', [''])
     Estatus_de_Cierre_de_Vuelos: Estatus_de_Cierre_de_Vuelo[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

