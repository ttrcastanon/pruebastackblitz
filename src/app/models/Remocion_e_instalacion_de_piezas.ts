import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Remocion_e_instalacion_de_piezas  extends BaseView {
    @FormField('Remocion', [0])
    Remocion = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('Remocion_e_instalacion_de_piezass', [''])
     Remocion_e_instalacion_de_piezass: Remocion_e_instalacion_de_piezas[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

