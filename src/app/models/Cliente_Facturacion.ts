import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Cliente_Facturacion  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    @FormField('Nombre', [''])
    Nombre = '';

     @FormField('Cliente_Facturacions', [''])
     Cliente_Facturacions: Cliente_Facturacion[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

