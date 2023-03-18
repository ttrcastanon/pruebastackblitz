import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Catalogo_Tipo_de_Vencimiento  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('Catalogo_Tipo_de_Vencimientos', [''])
     Catalogo_Tipo_de_Vencimientos: Catalogo_Tipo_de_Vencimiento[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

