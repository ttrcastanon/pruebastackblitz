import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Pasajeros } from './Pasajeros';


export class Detalle_pasajeros_tramo_de_vuelo  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Solicitud_de_Vuelo = 0;
    @FormField('Pasajero', [''])
    Pasajero = null;
    Pasajero_Pasajeros: Pasajeros;
    @FormField('Tramo_de_Vuelo', [''])
    Tramo_de_Vuelo = '';

     @FormField('Detalle_pasajeros_tramo_de_vuelos', [''])
     Detalle_pasajeros_tramo_de_vuelos: Detalle_pasajeros_tramo_de_vuelo[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

