import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Pasajeros } from './Pasajeros';


export class Detalle_Pasajeros_Solicitud_de_Vuelo extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Solicitud_de_Vuelo = 0;
    @FormField('Pasajero', ['', Validators.required])
    Pasajero = null;
    Pasajero_Pasajeros: Pasajeros;

    @FormField('Detalle_Pasajeros_Solicitud_de_Vuelos', [''])
    Detalle_Pasajeros_Solicitud_de_Vuelos: Detalle_Pasajeros_Solicitud_de_Vuelo[] = [];

    edit = false;
    isNew = false;
    IsDeleted = false;
}

