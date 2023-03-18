import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Proveedores_para_MS  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Razon_Social', [''])
    Razon_Social = '';

     @FormField('Proveedores_para_MSs', [''])
     Proveedores_para_MSs: Proveedores_para_MS[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

