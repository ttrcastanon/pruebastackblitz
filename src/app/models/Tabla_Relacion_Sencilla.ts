import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Tabla_Relacion_Sencilla  extends BaseView {
    @FormField('idTablaSencilla', [0, Validators.required])
    idTablaSencilla = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('Tabla_Relacion_Sencillas', [''])
     Tabla_Relacion_Sencillas: Tabla_Relacion_Sencilla[] = [];
        
}

