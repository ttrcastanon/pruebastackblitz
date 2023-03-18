import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Pasajeros } from './Pasajeros';


export class Detalle_Ejecucion_de_vuelo_pasajeros_adicionales  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Tramo_de_vuelo = 0;
    @FormField('Pasajeros', [''])
    Pasajeros = null;
    Pasajeros_Pasajeros: Pasajeros;

     @FormField('Detalle_Ejecucion_de_vuelo_pasajeros_adicionaless', [''])
     Detalle_Ejecucion_de_vuelo_pasajeros_adicionaless: Detalle_Ejecucion_de_vuelo_pasajeros_adicionales[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

