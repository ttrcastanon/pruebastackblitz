import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Razon_de_la_Compra  extends BaseView {
    @FormField('Razon', [0])
    Razon = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('Razon_de_la_Compras', [''])
     Razon_de_la_Compras: Razon_de_la_Compra[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

