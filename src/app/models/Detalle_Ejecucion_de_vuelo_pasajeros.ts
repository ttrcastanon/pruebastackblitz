import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Pasajeros } from './Pasajeros';


export class Detalle_Ejecucion_de_vuelo_pasajeros  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Tramo_de_vuelo', [''])
    Tramo_de_vuelo = 0;
    @FormField('Pasajeros', [''])
    Pasajeros = null;
    Pasajeros_Pasajeros: Pasajeros;

     @FormField('Detalle_Ejecucion_de_vuelo_pasajeross', [''])
     Detalle_Ejecucion_de_vuelo_pasajeross: Detalle_Ejecucion_de_vuelo_pasajeros[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

