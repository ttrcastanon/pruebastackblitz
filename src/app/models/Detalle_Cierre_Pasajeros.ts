import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Pasajeros } from './Pasajeros';


export class Detalle_Cierre_Pasajeros  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Cierre_de_Vuelo = 0;
    @FormField('Pasajero', [''])
    Pasajero = null;
    Pasajero_Pasajeros: Pasajeros;
    @FormField('PasajeroEjecucionId', [0])
    PasajeroEjecucionId = null;

     @FormField('Detalle_Cierre_Pasajeross', [''])
     Detalle_Cierre_Pasajeross: Detalle_Cierre_Pasajeros[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

