import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Solicitud_de_Vuelo } from './Solicitud_de_Vuelo';
import { Aeronave } from './Aeronave';
import { Registro_de_vuelo } from './Registro_de_vuelo';
import { Aeropuertos } from './Aeropuertos';
import { Respuesta } from './Respuesta';
import { Detalle_Cierre_Tripulacion } from './Detalle_Cierre_Tripulacion';
import { Detalle_Cierre_Pasajeros } from './Detalle_Cierre_Pasajeros';


export class Cierre_de_Vuelo  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Numero_de_Vuelo', [''])
    Numero_de_Vuelo = null;
    Numero_de_Vuelo_Solicitud_de_Vuelo: Solicitud_de_Vuelo;
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('Solicitud', [''])
    Solicitud = '';
    @FormField('Tramo_de_Vuelo', [''])
    Tramo_de_Vuelo = null;
    Tramo_de_Vuelo_Registro_de_vuelo: Registro_de_vuelo;
    @FormField('Origen', [''])
    Origen = null;
    Origen_Aeropuertos: Aeropuertos;
    @FormField('Destino', [''])
    Destino = null;
    Destino_Aeropuertos: Aeropuertos;
    @FormField('Fecha_Salida', [''])
    Fecha_Salida = '';
    @FormField('Hora_Salida', [''])
    Hora_Salida = '';
    @FormField('Fecha_Despegue', [''])
    Fecha_Despegue = '';
    @FormField('Hora_Despegue', [''])
    Hora_Despegue = '';
    @FormField('Fecha_Aterrizaje', [''])
    Fecha_Aterrizaje = '';
    @FormField('Hora_Aterrizaje', [''])
    Hora_Aterrizaje = '';
    @FormField('Fecha_Llegada', [''])
    Fecha_Llegada = '';
    @FormField('Hora_Llegada', [''])
    Hora_Llegada = '';
    @FormField('Pasajeros_Adicionales', [0])
    Pasajeros_Adicionales = null;
    @FormField('Combustible_Inicial', [''])
    Combustible_Inicial = null;
    @FormField('Cumbustible_Final_Consumido', [''])
    Cumbustible_Final_Consumido = null;
    @FormField('Combustible_Total_Consumido', [''])
    Combustible_Total_Consumido = null;
    @FormField('Notas_de_Tramo', [''])
    Notas_de_Tramo = '';
    @FormField('cerrar_vuelo', [''])
    cerrar_vuelo = null;
    cerrar_vuelo_Respuesta: Respuesta;
    @FormField('Detalle_Cierre_TripulacionItems', [], Detalle_Cierre_Tripulacion,  true)
    Detalle_Cierre_TripulacionItems: FormArray;

    @FormField('Detalle_Cierre_PasajerosItems', [], Detalle_Cierre_Pasajeros,  true)
    Detalle_Cierre_PasajerosItems: FormArray;


     @FormField('Cierre_de_Vuelos', [''])
     Cierre_de_Vuelos: Cierre_de_Vuelo[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

