import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Aeropuertos } from './Aeropuertos';


export class Detalle_Tramo_de_vuelo  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Solicitud_de_Vuelo = 0;
    @FormField('No', [''])
    No = '';
    @FormField('Origen', [''])
    Origen = null;
    Origen_Aeropuertos: Aeropuertos;
    @FormField('Fecha_de_salida', [''])
    Fecha_de_salida = '';
    @FormField('Hora_de_salida', [''])
    Hora_de_salida = '';
    @FormField('Destino', [''])
    Destino = null;
    Destino_Aeropuertos: Aeropuertos;

     @FormField('Detalle_Tramo_de_vuelos', [''])
     Detalle_Tramo_de_vuelos: Detalle_Tramo_de_vuelo[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

