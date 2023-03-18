import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Catalago_Manual_de_Usuario  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('Catalago_Manual_de_Usuarios', [''])
     Catalago_Manual_de_Usuarios: Catalago_Manual_de_Usuario[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

