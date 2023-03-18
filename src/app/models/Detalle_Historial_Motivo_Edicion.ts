import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Motivo_de_Edicion_de_Cotizacion } from './Motivo_de_Edicion_de_Cotizacion';
import { Spartan_User } from './Spartan_User';


export class Detalle_Historial_Motivo_Edicion  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Cotizacion = 0;
    @FormField('Motivo_de_Edicion', [''])
    Motivo_de_Edicion = null;
    Motivo_de_Edicion_Motivo_de_Edicion_de_Cotizacion: Motivo_de_Edicion_de_Cotizacion;
    @FormField('Observaciones', [''])
    Observaciones = '';
    @FormField('Fecha', [''])
    Fecha = '';
    @FormField('Hora', [''])
    Hora = '';
    @FormField('Usuario', [''])
    Usuario = null;
    Usuario_Spartan_User: Spartan_User;

     @FormField('Detalle_Historial_Motivo_Edicions', [''])
     Detalle_Historial_Motivo_Edicions: Detalle_Historial_Motivo_Edicion[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

