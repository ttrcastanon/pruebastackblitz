import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Estatus_autorizacion_de_prefactura  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('Estatus_autorizacion_de_prefacturas', [''])
     Estatus_autorizacion_de_prefacturas: Estatus_autorizacion_de_prefactura[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

