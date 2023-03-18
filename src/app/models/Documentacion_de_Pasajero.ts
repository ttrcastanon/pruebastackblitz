import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Documentacion_de_Pasajero  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('Documentacion_de_Pasajeros', [''])
     Documentacion_de_Pasajeros: Documentacion_de_Pasajero[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

