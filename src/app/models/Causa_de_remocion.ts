import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Causa_de_remocion  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('Causa_de_remocions', [''])
     Causa_de_remocions: Causa_de_remocion[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

