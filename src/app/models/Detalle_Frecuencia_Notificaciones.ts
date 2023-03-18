import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Tipo_Frecuencia_Notificacion } from './Tipo_Frecuencia_Notificacion';
import { Tipo_Dia_Notificacion } from './Tipo_Dia_Notificacion';


export class Detalle_Frecuencia_Notificaciones  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    FolioNotificacion = 0;
    @FormField('Frecuencia', [''])
    Frecuencia = null;
    Frecuencia_Tipo_Frecuencia_Notificacion: Tipo_Frecuencia_Notificacion;
    @FormField('Dia', [''])
    Dia = null;
    Dia_Tipo_Dia_Notificacion: Tipo_Dia_Notificacion;
    @FormField('Hora', [''])
    Hora = '';

     @FormField('Detalle_Frecuencia_Notificacioness', [''])
     Detalle_Frecuencia_Notificacioness: Detalle_Frecuencia_Notificaciones[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

