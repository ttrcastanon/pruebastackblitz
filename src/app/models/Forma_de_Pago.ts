import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Forma_de_Pago  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('Forma_de_Pagos', [''])
     Forma_de_Pagos: Forma_de_Pago[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

