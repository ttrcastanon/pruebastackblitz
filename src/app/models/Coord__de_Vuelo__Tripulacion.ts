import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Solicitud_de_Vuelo } from './Solicitud_de_Vuelo';
import { Aeronave } from './Aeronave';
import { Detalle_Coord_Tripulacion } from './Detalle_Coord_Tripulacion';
import { Detalle_Coord_Tripulacion_Reservaciones } from './Detalle_Coord_Tripulacion_Reservaciones';
import { Detalle_Coord_Tripulacion_Transportacion } from './Detalle_Coord_Tripulacion_Transportacion';


export class Coord__de_Vuelo__Tripulacion  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Numero_de_Vuelo', [''])
    Numero_de_Vuelo = null;
    Numero_de_Vuelo_Solicitud_de_Vuelo: Solicitud_de_Vuelo;
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('_Tripulante', [''])
    _Tripulante = null;
    @FormField('Ruta_de_Vuelo', [''])
    Ruta_de_Vuelo = '';
    @FormField('Fecha_y_Hora_de_Salida', [''])
    Fecha_y_Hora_de_Salida = '';
    @FormField('Calificacion', [0])
    Calificacion = null;
    @FormField('Observaciones', [''])
    Observaciones = '';
    @FormField('Detalle_Coord_TripulacionItems', [], Detalle_Coord_Tripulacion,  true)
    Detalle_Coord_TripulacionItems: FormArray;

    @FormField('Detalle_Coord_Tripulacion_ReservacionesItems', [], Detalle_Coord_Tripulacion_Reservaciones,  true)
    Detalle_Coord_Tripulacion_ReservacionesItems: FormArray;

    @FormField('Detalle_Coord_Tripulacion_TransportacionItems', [], Detalle_Coord_Tripulacion_Transportacion,  true)
    Detalle_Coord_Tripulacion_TransportacionItems: FormArray;


     @FormField('Coord__de_Vuelo__Tripulacions', [''])
     Coord__de_Vuelo__Tripulacions: Coord__de_Vuelo__Tripulacion[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

