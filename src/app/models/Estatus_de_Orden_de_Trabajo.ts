import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Estatus_de_Orden_de_Trabajo  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('Estatus_de_Orden_de_Trabajos', [''])
     Estatus_de_Orden_de_Trabajos: Estatus_de_Orden_de_Trabajo[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

