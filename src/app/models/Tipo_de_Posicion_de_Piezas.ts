import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Tipo_de_Posicion_de_Piezas  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('Tipo_de_Posicion_de_Piezass', [''])
     Tipo_de_Posicion_de_Piezass: Tipo_de_Posicion_de_Piezas[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

