import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Solicitud_de_Vuelo } from './Solicitud_de_Vuelo';
import { Aeronave } from './Aeronave';
import { Cliente } from './Cliente';
import { Spartan_User } from './Spartan_User';
import { Tipo_de_vuelo } from './Tipo_de_vuelo';
import { Aeropuertos } from './Aeropuertos';
import { Detalle_Registro_Vuelo_Tripulacion } from './Detalle_Registro_Vuelo_Tripulacion';
import { Detalle_Registro_Vuelo_Pasajeros } from './Detalle_Registro_Vuelo_Pasajeros';


export class Registro_de_vuelo  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('No_Vuelo', [''])
    No_Vuelo = null;
    No_Vuelo_Solicitud_de_Vuelo: Solicitud_de_Vuelo;
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('Fecha_de_solicitud', [''])
    Fecha_de_solicitud = '';
    @FormField('Cliente', [''])
    Cliente = null;
    Cliente_Cliente: Cliente;
    @FormField('Solicitante', [''])
    Solicitante = null;
    Solicitante_Spartan_User: Spartan_User;
    @FormField('Tipo_de_vuelo', [''])
    Tipo_de_vuelo = null;
    Tipo_de_vuelo_Tipo_de_vuelo: Tipo_de_vuelo;
    @FormField('Numero_de_Tramo', [''])
    Numero_de_Tramo = '';
    @FormField('Origen', [''])
    Origen = null;
    Origen_Aeropuertos: Aeropuertos;
    @FormField('Destino', [''])
    Destino = null;
    Destino_Aeropuertos: Aeropuertos;
    @FormField('Fecha_de_salida', [''])
    Fecha_de_salida = '';
    @FormField('Hora_de_salida', [''])
    Hora_de_salida = '';
    @FormField('Cantidad_de_Pasajeros', [0])
    Cantidad_de_Pasajeros = null;
    @FormField('Ultimo_Tramo_notificar', [false])
    Ultimo_Tramo_notificar = false;
    @FormField('Detalle_Registro_Vuelo_TripulacionItems', [], Detalle_Registro_Vuelo_Tripulacion,  true)
    Detalle_Registro_Vuelo_TripulacionItems: FormArray;

    @FormField('Detalle_Registro_Vuelo_PasajerosItems', [], Detalle_Registro_Vuelo_Pasajeros,  true)
    Detalle_Registro_Vuelo_PasajerosItems: FormArray;

    @FormField('Comisariato', [''])
    Comisariato = '';
    @FormField('Notas_de_vuelo', [''])
    Notas_de_vuelo = '';

     @FormField('Registro_de_vuelos', [''])
     Registro_de_vuelos: Registro_de_vuelo[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

