import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Tipo_de_Miscelaneas  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('Tipo_de_Miscelaneass', [''])
     Tipo_de_Miscelaneass: Tipo_de_Miscelaneas[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

