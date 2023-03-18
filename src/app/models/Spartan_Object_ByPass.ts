import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Spartan_Object_ByPass  extends BaseView {
    @FormField('Description', [''])
    Description = '';

     @FormField('Spartan_Object_ByPasss', [''])
     Spartan_Object_ByPasss: Spartan_Object_ByPass[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

