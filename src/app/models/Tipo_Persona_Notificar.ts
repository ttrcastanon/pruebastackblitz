import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Tipo_Persona_Notificar  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';
    @FormField('Clave_Rol', [0])
    Clave_Rol = null;

     @FormField('Tipo_Persona_Notificars', [''])
     Tipo_Persona_Notificars: Tipo_Persona_Notificar[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

