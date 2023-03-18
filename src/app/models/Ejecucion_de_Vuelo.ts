import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Solicitud_de_Vuelo } from './Solicitud_de_Vuelo';
import { Registro_de_vuelo } from './Registro_de_vuelo';
import { Aeronave } from './Aeronave';
import { Tipo_de_Ala } from './Tipo_de_Ala';
import { Aeropuertos } from './Aeropuertos';
import { Tripulacion } from './Tripulacion';
import { Tipo_de_vuelo } from './Tipo_de_vuelo';
import { Detalle_Ejecucion_de_vuelo_pasajeros } from './Detalle_Ejecucion_de_vuelo_pasajeros';
import { Detalle_Ejecucion_de_vuelo_pasajeros_adicionales } from './Detalle_Ejecucion_de_vuelo_pasajeros_adicionales';
import { Detalle_Ejecucion_Vuelo_Parametros } from './Detalle_Ejecucion_Vuelo_Parametros';
import { Detalle_Ejecucion_Vuelo_Componentes } from './Detalle_Ejecucion_Vuelo_Componentes';
import { Detalle_Ejecucion_Vuelo_Altimetros } from './Detalle_Ejecucion_Vuelo_Altimetros';


export class Ejecucion_de_Vuelo  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Numero_de_Vuelo', [''])
    Numero_de_Vuelo = null;
    Numero_de_Vuelo_Solicitud_de_Vuelo: Solicitud_de_Vuelo;
    @FormField('Tramo_de_Vuelo', [''])
    Tramo_de_Vuelo = null;
    Tramo_de_Vuelo_Registro_de_vuelo: Registro_de_vuelo;
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('Tipo_de_Ala', [''])
    Tipo_de_Ala = null;
    Tipo_de_Ala_Tipo_de_Ala: Tipo_de_Ala;
    @FormField('Solicitud', [''])
    Solicitud = '';
    @FormField('Origen', [''])
    Origen = null;
    Origen_Aeropuertos: Aeropuertos;
    @FormField('Destino', [''])
    Destino = null;
    Destino_Aeropuertos: Aeropuertos;
    @FormField('Distancia_FIR_Km', [0])
    Distancia_FIR_Km = null;
    @FormField('Comandante', [''])
    Comandante = null;
    Comandante_Tripulacion: Tripulacion;
    @FormField('Capitan', [''])
    Capitan = null;
    Capitan_Tripulacion: Tripulacion;
    @FormField('Primer_Capitan', [''])
    Primer_Capitan = null;
    Primer_Capitan_Tripulacion: Tripulacion;
    @FormField('Segundo_Capitan', [''])
    Segundo_Capitan = null;
    Segundo_Capitan_Tripulacion: Tripulacion;
    @FormField('Sobrecargo', [''])
    Sobrecargo = null;
    Sobrecargo_Tripulacion: Tripulacion;
    @FormField('Administrador_del_Vuelo', [''])
    Administrador_del_Vuelo = null;
    Administrador_del_Vuelo_Tripulacion: Tripulacion;
    @FormField('Tipo_de_Vuelo', [''])
    Tipo_de_Vuelo = null;
    Tipo_de_Vuelo_Tipo_de_vuelo: Tipo_de_vuelo;
    @FormField('Pasajeros_Adicionales', [0])
    Pasajeros_Adicionales = null;
    @FormField('Fecha_de_Salida', [''])
    Fecha_de_Salida = '';
    @FormField('Hora_de_Salida', [''])
    Hora_de_Salida = '';
    @FormField('Fecha_de_Llegada', [''])
    Fecha_de_Llegada = '';
    @FormField('Hora_de_Llegada', [''])
    Hora_de_Llegada = '';
    @FormField('Fecha_de_Despegue', [''])
    Fecha_de_Despegue = '';
    @FormField('Hora_de_Despegue', [''])
    Hora_de_Despegue = '';
    @FormField('Fecha_de_Aterrizaje', [''])
    Fecha_de_Aterrizaje = '';
    @FormField('Hora_de_Aterrizaje', [''])
    Hora_de_Aterrizaje = '';
    @FormField('Fecha_de_Salida_Local', [''])
    Fecha_de_Salida_Local = '';
    @FormField('Hora_de_Salida_Local', [''])
    Hora_de_Salida_Local = '';
    @FormField('Fecha_de_Llegada_Local', [''])
    Fecha_de_Llegada_Local = '';
    @FormField('Hora_de_Llegada_Local', [''])
    Hora_de_Llegada_Local = '';
    @FormField('Fecha_de_Despegue_Local', [''])
    Fecha_de_Despegue_Local = '';
    @FormField('Hora_de_Despegue_Local', [''])
    Hora_de_Despegue_Local = '';
    @FormField('Fecha_de_Aterrizaje_Local', [''])
    Fecha_de_Aterrizaje_Local = '';
    @FormField('Hora_de_Aterrizaje_Local', [''])
    Hora_de_Aterrizaje_Local = '';
    @FormField('Internacional', [false])
    Internacional = false;
    @FormField('Tiempo_de_Calzo', [''])
    Tiempo_de_Calzo = '';
    @FormField('Tiempo_de_Vuelo', [''])
    Tiempo_de_Vuelo = '';
    @FormField('Distancia_en_Millas', [''])
    Distancia_en_Millas = null;
    @FormField('Combustible__Cargado', [0])
    Combustible__Cargado = null;
    @FormField('Combustible__Despegue', [0])
    Combustible__Despegue = null;
    @FormField('Combustible__Aterrizaje', [0])
    Combustible__Aterrizaje = null;
    @FormField('Combustible__Consumo', [0])
    Combustible__Consumo = null;
    @FormField('Observaciones', [''])
    Observaciones = '';
    @FormField('Detalle_Ejecucion_de_vuelo_pasajerosItems', [], Detalle_Ejecucion_de_vuelo_pasajeros,  true)
    Detalle_Ejecucion_de_vuelo_pasajerosItems: FormArray;

    @FormField('Detalle_Ejecucion_de_vuelo_pasajeros_adicionalesItems', [], Detalle_Ejecucion_de_vuelo_pasajeros_adicionales,  true)
    Detalle_Ejecucion_de_vuelo_pasajeros_adicionalesItems: FormArray;

    @FormField('Detalle_Ejecucion_Vuelo_ParametrosItems', [], Detalle_Ejecucion_Vuelo_Parametros,  true)
    Detalle_Ejecucion_Vuelo_ParametrosItems: FormArray;

    @FormField('Detalle_Ejecucion_Vuelo_ComponentesItems', [], Detalle_Ejecucion_Vuelo_Componentes,  true)
    Detalle_Ejecucion_Vuelo_ComponentesItems: FormArray;

    @FormField('Detalle_Ejecucion_Vuelo_AltimetrosItems', [], Detalle_Ejecucion_Vuelo_Altimetros,  true)
    Detalle_Ejecucion_Vuelo_AltimetrosItems: FormArray;

    @FormField('Reportes_de_la_Aeronave', [''])
    Reportes_de_la_Aeronave = '';
    @FormField('Tiempo_de_Espera_Paso', [0])
    Tiempo_de_Espera_Paso = null;
    @FormField('Tiempo_de_Espera', [''])
    Tiempo_de_Espera = '';
    @FormField('Tiempo_de_Espera_Con_Costo', [''])
    Tiempo_de_Espera_Con_Costo = '';
    @FormField('Tiempo_de_Espera_Sin_Costo', [''])
    Tiempo_de_Espera_Sin_Costo = '';
    @FormField('Pernoctas', [0])
    Pernoctas = null;

     @FormField('Ejecucion_de_Vuelos', [''])
     Ejecucion_de_Vuelos: Ejecucion_de_Vuelo[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

