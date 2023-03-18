import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Tipo_de_Ingreso_a_Cotizacion  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('Tipo_de_Ingreso_a_Cotizacions', [''])
     Tipo_de_Ingreso_a_Cotizacions: Tipo_de_Ingreso_a_Cotizacion[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

