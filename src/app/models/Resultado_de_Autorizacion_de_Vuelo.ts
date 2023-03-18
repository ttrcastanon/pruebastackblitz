import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Resultado_de_Autorizacion_de_Vuelo  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('Resultado_de_Autorizacion_de_Vuelos', [''])
     Resultado_de_Autorizacion_de_Vuelos: Resultado_de_Autorizacion_de_Vuelo[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

