import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Categoria_de_Partes  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Categoria', [''])
    Categoria = '';

     @FormField('Categoria_de_Partess', [''])
     Categoria_de_Partess: Categoria_de_Partes[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

