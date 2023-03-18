import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Clasificacion_de_proveedores  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('Clasificacion_de_proveedoress', [''])
     Clasificacion_de_proveedoress: Clasificacion_de_proveedores[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

