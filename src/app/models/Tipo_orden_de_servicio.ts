import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Tipo_orden_de_servicio  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('Tipo_orden_de_servicios', [''])
     Tipo_orden_de_servicios: Tipo_orden_de_servicio[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

