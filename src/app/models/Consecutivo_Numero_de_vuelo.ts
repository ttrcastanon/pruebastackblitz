import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Consecutivo_Numero_de_vuelo  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Valor', [''])
    Valor = '';

     @FormField('Consecutivo_Numero_de_vuelos', [''])
     Consecutivo_Numero_de_vuelos: Consecutivo_Numero_de_vuelo[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

