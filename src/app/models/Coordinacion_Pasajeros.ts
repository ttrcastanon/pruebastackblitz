import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Solicitud_de_Vuelo } from './Solicitud_de_Vuelo';
import { Aeronave } from './Aeronave';
import { Detalle_Coordinacion_Paxs_Servicios } from './Detalle_Coordinacion_Paxs_Servicios';
import { Detalle_Coord_Paxs_Comisariato_Periodico_y_Revistas } from './Detalle_Coord_Paxs_Comisariato_Periodico_y_Revistas';
import { Detalle_Coord_Paxs_Comisariato_Normal } from './Detalle_Coord_Paxs_Comisariato_Normal';
import { Detalle_Coord_Paxs_Comisariato_Instalaciones } from './Detalle_Coord_Paxs_Comisariato_Instalaciones';
import { Detalle_Coord_Paxs_Reservaciones } from './Detalle_Coord_Paxs_Reservaciones';
import { Detalle_Coord_Paxs_Transportacion } from './Detalle_Coord_Paxs_Transportacion';


export class Coordinacion_Pasajeros  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Numero_de_Vuelo', [''])
    Numero_de_Vuelo = null;
    Numero_de_Vuelo_Solicitud_de_Vuelo: Solicitud_de_Vuelo;
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('Pasajero', [''])
    Pasajero = null;
    @FormField('Ruta_de_Vuelo', [''])
    Ruta_de_Vuelo = '';
    @FormField('Fecha_y_Hora_de_Salida', [''])
    Fecha_y_Hora_de_Salida = '';
    @FormField('Calificacion', [0])
    Calificacion = null;
    @FormField('Observaciones', [''])
    Observaciones = '';
    @FormField('Detalle_Coordinacion_Paxs_ServiciosItems', [], Detalle_Coordinacion_Paxs_Servicios,  true)
    Detalle_Coordinacion_Paxs_ServiciosItems: FormArray;

    @FormField('Detalle_Coord_Paxs_Comisariato_Periodico_y_RevistasItems', [], Detalle_Coord_Paxs_Comisariato_Periodico_y_Revistas,  true)
    Detalle_Coord_Paxs_Comisariato_Periodico_y_RevistasItems: FormArray;

    @FormField('Detalle_Coord_Paxs_Comisariato_NormalItems', [], Detalle_Coord_Paxs_Comisariato_Normal,  true)
    Detalle_Coord_Paxs_Comisariato_NormalItems: FormArray;

    @FormField('Detalle_Coord_Paxs_Comisariato_InstalacionesItems', [], Detalle_Coord_Paxs_Comisariato_Instalaciones,  true)
    Detalle_Coord_Paxs_Comisariato_InstalacionesItems: FormArray;

    @FormField('Notas_C', [''])
    Notas_C = '';
    @FormField('Detalle_Coord_Paxs_ReservacionesItems', [], Detalle_Coord_Paxs_Reservaciones,  true)
    Detalle_Coord_Paxs_ReservacionesItems: FormArray;

    @FormField('Detalle_Coord_Paxs_TransportacionItems', [], Detalle_Coord_Paxs_Transportacion,  true)
    Detalle_Coord_Paxs_TransportacionItems: FormArray;


     @FormField('Coordinacion_Pasajeross', [''])
     Coordinacion_Pasajeross: Coordinacion_Pasajeros[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

