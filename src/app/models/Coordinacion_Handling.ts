import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Solicitud_de_Vuelo } from './Solicitud_de_Vuelo';
import { Aeronave } from './Aeronave';
import { Detalle_Coordinacion_Handling } from './Detalle_Coordinacion_Handling';
import { Aeropuertos } from './Aeropuertos';


export class Coordinacion_Handling extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Numero_de_Vuelo', [''])
    Numero_de_Vuelo = null;
    Numero_de_Vuelo_Solicitud_de_Vuelo: Solicitud_de_Vuelo;
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('Ruta_de_Vuelo', [''])
    Ruta_de_Vuelo = '';
    @FormField('Destino', [''])
    Destino = null;
    Destino_Aeropuertos: Aeropuertos;
    @FormField('Fecha_y_Hora_de_Salida', [''])
    Fecha_y_Hora_de_Salida = '';
    @FormField('Calificacion', [0])
    Calificacion = null;
    @FormField('Observaciones', [''])
    Observaciones = '';
    @FormField('Detalle_Coordinacion_HandlingItems', [], Detalle_Coordinacion_Handling, true)
    Detalle_Coordinacion_HandlingItems: FormArray;


    @FormField('Coordinacion_Handlings', [''])
    Coordinacion_Handlings: Coordinacion_Handling[] = [];

    edit = false;
    isNew = false;
    IsDeleted = false;
}

