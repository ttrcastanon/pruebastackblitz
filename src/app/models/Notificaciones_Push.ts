import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Spartan_User } from './Spartan_User';
import { Tipo_de_Notificacion_Push } from './Tipo_de_Notificacion_Push';


export class Notificaciones_Push  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Fecha', [''])
    Fecha = '';
    @FormField('Hora', [''])
    Hora = '';
    @FormField('Destinatario', [''])
    Destinatario = null;
    Destinatario_Spartan_User: Spartan_User;
    @FormField('Parametros_Adicionales', [''])
    Parametros_Adicionales = '';
    @FormField('Notificacion', [''])
    Notificacion = '';
    @FormField('Leida', [false])
    Leida = false;
    @FormField('Titulo', [''])
    Titulo = '';
    @FormField('Tipo', [''])
    Tipo = null;
    Tipo_Tipo_de_Notificacion_Push: Tipo_de_Notificacion_Push;

     @FormField('Notificaciones_Pushs', [''])
     Notificaciones_Pushs: Notificaciones_Push[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

