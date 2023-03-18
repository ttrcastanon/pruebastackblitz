import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Solicitud_de_Vuelo } from './Solicitud_de_Vuelo';


export class Historial_de_Cambios  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Numero_de_Vuelo', [''])
    Numero_de_Vuelo = null;
    Numero_de_Vuelo_Solicitud_de_Vuelo: Solicitud_de_Vuelo;
    @FormField('Fecha', [''])
    Fecha = '';
    @FormField('Hora', [''])
    Hora = '';
    @FormField('Cambio_Realizado', [''])
    Cambio_Realizado = '';

     @FormField('Historial_de_Cambioss', [''])
     Historial_de_Cambioss: Historial_de_Cambios[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

