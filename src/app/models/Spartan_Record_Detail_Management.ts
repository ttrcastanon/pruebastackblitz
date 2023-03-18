import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Spartan_User } from './Spartan_User';
import { Spartan_Object_ByPass } from './Spartan_Object_ByPass';
import { Spartan_Attribute_Bypass } from './Spartan_Attribute_Bypass';
import { Spartan_RDM_Filters_Detail } from './Spartan_RDM_Filters_Detail';
import { Spartan_RDM_Operations_Detail } from './Spartan_RDM_Operations_Detail';


export class Spartan_Record_Detail_Management  extends BaseView {
    @FormField('Process_Id', [0])
    Process_Id = 0;
    @FormField('Register_Date', [''])
    Register_Date = '';
    @FormField('Register_Hour', [''])
    Register_Hour = '';
    @FormField('Register_User', [''])
    Register_User = null;
    Register_User_Spartan_User: Spartan_User;
    @FormField('Description', [''])
    Description = '';
    @FormField('Object', [''])
    Object = null;
    Object_Spartan_Object_ByPass: Spartan_Object_ByPass;
    @FormField('Reference_Label', [''])
    Reference_Label = '';
    @FormField('Reference_Field', [''])
    Reference_Field = null;
    Reference_Field_Spartan_Attribute_Bypass: Spartan_Attribute_Bypass;
    @FormField('Spartan_RDM_Filters_DetailItems', [], Spartan_RDM_Filters_Detail,  true)
    Spartan_RDM_Filters_DetailItems: FormArray;

    @FormField('Search_Result', [0])
    Search_Result = null;
    @FormField('Search_Result_Query', [''])
    Search_Result_Query = '';
    @FormField('Image_Field', [''])
    Image_Field = null;
    Image_Field_Spartan_Attribute_Bypass: Spartan_Attribute_Bypass;
    @FormField('Data_Detail', [0])
    Data_Detail = null;
    @FormField('Query_Data_Detail', [''])
    Query_Data_Detail = '';
    @FormField('Spartan_RDM_Operations_DetailItems', [], Spartan_RDM_Operations_Detail,  true)
    Spartan_RDM_Operations_DetailItems: FormArray;


     @FormField('Spartan_Record_Detail_Managements', [''])
     Spartan_Record_Detail_Managements: Spartan_Record_Detail_Management[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

