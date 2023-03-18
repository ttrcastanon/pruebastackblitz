import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Tabla_Relacion_Autocompletable  extends BaseView {
    @FormField('idTablaAuto', [0, Validators.required])
    idTablaAuto = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('Tabla_Relacion_Autocompletables', [''])
     Tabla_Relacion_Autocompletables: Tabla_Relacion_Autocompletable[] = [];
        
}

