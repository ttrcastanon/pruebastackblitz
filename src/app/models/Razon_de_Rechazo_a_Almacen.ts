import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Razon_de_Rechazo_a_Almacen  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('Razon_de_Rechazo_a_Almacens', [''])
     Razon_de_Rechazo_a_Almacens: Razon_de_Rechazo_a_Almacen[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

