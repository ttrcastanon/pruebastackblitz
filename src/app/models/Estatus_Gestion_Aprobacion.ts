import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Estatus_Gestion_Aprobacion  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('Estatus_Gestion_Aprobacions', [''])
     Estatus_Gestion_Aprobacions: Estatus_Gestion_Aprobacion[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

