import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Solicitud_de_Vuelo } from './Solicitud_de_Vuelo';


export class Comisariato_y_notas_de_vuelo  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Numero_de_Vuelo', [''])
    Numero_de_Vuelo = null;
    Numero_de_Vuelo_Solicitud_de_Vuelo: Solicitud_de_Vuelo;
    @FormField('Comisariato', [''])
    Comisariato = '';
    @FormField('Notas_de_vuelo', [''])
    Notas_de_vuelo = '';

     @FormField('Comisariato_y_notas_de_vuelos', [''])
     Comisariato_y_notas_de_vuelos: Comisariato_y_notas_de_vuelo[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

