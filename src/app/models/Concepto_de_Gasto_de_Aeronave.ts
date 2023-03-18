import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Concepto_de_Gasto_de_Aeronave  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('Concepto_de_Gasto_de_Aeronaves', [''])
     Concepto_de_Gasto_de_Aeronaves: Concepto_de_Gasto_de_Aeronave[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

