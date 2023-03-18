import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Tipo_de_Tarifa_de_GMM  extends BaseView {
    @FormField('Clave', [0, Validators.required])
    Clave = 0;
    @FormField('Descripcion', ['', Validators.required])
    Descripcion = '';

     @FormField('Tipo_de_Tarifa_de_GMMs', [''])
     Tipo_de_Tarifa_de_GMMs: Tipo_de_Tarifa_de_GMM[] = [];
        
}

