import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Equipo_de_Navegacion  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('Equipo_de_Navegacions', [''])
     Equipo_de_Navegacions: Equipo_de_Navegacion[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

