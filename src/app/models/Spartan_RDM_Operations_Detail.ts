import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Spartan_Object_ByPass } from './Spartan_Object_ByPass';


export class Spartan_RDM_Operations_Detail  extends BaseView {
    @FormField('DetailId', [0])
    DetailId = 0;
    Record_Detail_Management = 0;
    @FormField('Object_Name', [''])
    Object_Name = null;
    Object_Name_Spartan_Object_ByPass: Spartan_Object_ByPass;
    @FormField('Object_Label', [''])
    Object_Label = '';
    @FormField('Order_Shown', [0])
    Order_Shown = null;
    @FormField('Count_Query', [''])
    Count_Query = '';
    @FormField('Query_Data', [''])
    Query_Data = '';
    @FormField('Icono', [''])
    Icono = null;
    @FormField('IconoFile', [''])
    IconoFile: FileInput = null;

     @FormField('Spartan_RDM_Operations_Details', [''])
     Spartan_RDM_Operations_Details: Spartan_RDM_Operations_Detail[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

