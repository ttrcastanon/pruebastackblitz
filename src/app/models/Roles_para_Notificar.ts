import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Tipo_Persona_Notificar } from './Tipo_Persona_Notificar';


export class Roles_para_Notificar  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Folio_Configuracion_de_Notificaciones = 0;
    @FormField('Rol', [''])
    Rol = null;
    Rol_Tipo_Persona_Notificar: Tipo_Persona_Notificar;

     @FormField('Roles_para_Notificars', [''])
     Roles_para_Notificars: Roles_para_Notificar[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

