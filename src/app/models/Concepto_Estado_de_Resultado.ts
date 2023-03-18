import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Concepto_Estado_de_Resultado  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('Concepto_Estado_de_Resultados', [''])
     Concepto_Estado_de_Resultados: Concepto_Estado_de_Resultado[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

