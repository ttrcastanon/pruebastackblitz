import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Condicion_del_item  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Condicion', [''])
    Condicion = '';

     @FormField('Condicion_del_items', [''])
     Condicion_del_items: Condicion_del_item[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

