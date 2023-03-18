import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Servicios_Aduanales  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('Servicios_Aduanaless', [''])
     Servicios_Aduanaless: Servicios_Aduanales[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

