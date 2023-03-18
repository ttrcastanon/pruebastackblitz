import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class proveedor_multi  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('proveedor_multis', [''])
     proveedor_multis: proveedor_multi[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

