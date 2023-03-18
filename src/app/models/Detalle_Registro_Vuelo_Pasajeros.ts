import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Pasajeros } from './Pasajeros';


export class Detalle_Registro_Vuelo_Pasajeros  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Registro_de_Vuelo = 0;
    @FormField('Pasajero', [''])
    Pasajero = null;
    Pasajero_Pasajeros: Pasajeros;
    @FormField('Vencimiento_Pasaporte', [''])
    Vencimiento_Pasaporte = '';

     @FormField('Detalle_Registro_Vuelo_Pasajeross', [''])
     Detalle_Registro_Vuelo_Pasajeross: Detalle_Registro_Vuelo_Pasajeros[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

