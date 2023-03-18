import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Spartan_Attribute_Bypass } from './Spartan_Attribute_Bypass';


export class Spartan_RDM_Filters_Detail  extends BaseView {
    @FormField('Filters_Detail_Id', [0])
    Filters_Detail_Id = 0;
    Record_Detail_Management = 0;
    @FormField('Field_Name', [''])
    Field_Name = null;
    Field_Name_Spartan_Attribute_Bypass: Spartan_Attribute_Bypass;
    @FormField('Field_Label', [''])
    Field_Label = '';
    @FormField('Order_Shown', [0])
    Order_Shown = null;
    @FormField('Field_Path', [''])
    Field_Path = '';
    @FormField('Physical_Field_Name', [''])
    Physical_Field_Name = '';
    @FormField('Logical_Field_Name', [''])
    Logical_Field_Name = '';

     @FormField('Spartan_RDM_Filters_Details', [''])
     Spartan_RDM_Filters_Details: Spartan_RDM_Filters_Detail[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

