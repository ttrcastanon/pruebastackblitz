import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Tipo_Concepto_Estado_Resultado  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('Tipo_Concepto_Estado_Resultados', [''])
     Tipo_Concepto_Estado_Resultados: Tipo_Concepto_Estado_Resultado[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

