import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Servicios  extends BaseView {
    @FormField('Codigo', [''])
    Codigo = '';
    @FormField('Descripcion', [''])
    Descripcion = '';
    @FormField('Descripcion_Busqueda', [''])
    Descripcion_Busqueda = '';

     @FormField('Servicioss', [''])
     Servicioss: Servicios[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

