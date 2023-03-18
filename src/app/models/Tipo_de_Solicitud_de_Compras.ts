import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Tipo_de_Solicitud_de_Compras  extends BaseView {
    @FormField('Tipo_de_Solicitud', [0])
    Tipo_de_Solicitud = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('Tipo_de_Solicitud_de_Comprass', [''])
     Tipo_de_Solicitud_de_Comprass: Tipo_de_Solicitud_de_Compras[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

