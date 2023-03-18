import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Spartan_Object_ByPass } from './Spartan_Object_ByPass';


export class Spartan_Attribute_Bypass  extends BaseView {
    @FormField('Description', [''])
    Description = '';
    @FormField('ObjectId', [''])
    ObjectId = null;
    ObjectId_Spartan_Object_ByPass: Spartan_Object_ByPass;

     @FormField('Spartan_Attribute_Bypasss', [''])
     Spartan_Attribute_Bypasss: Spartan_Attribute_Bypass[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

