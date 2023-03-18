import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Spartan_User } from './Spartan_User';
import { Cliente } from './Cliente';
import { Detalle_Pasajeros_Solicitud_de_Vuelo } from './Detalle_Pasajeros_Solicitud_de_Vuelo';
import { Estatus_de_Solicitud_de_Vuelo } from './Estatus_de_Solicitud_de_Vuelo';
import { Resultado_de_Autorizacion_de_Vuelo } from './Resultado_de_Autorizacion_de_Vuelo';


export class Solicitud_de_Vuelo  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Fecha_de_Solicitud', [''])
    Fecha_de_Solicitud = '';
    @FormField('Hora_de_Solicitud', [''])
    Hora_de_Solicitud = '';
    @FormField('Solicitante', [''])
    Solicitante = null;
    Solicitante_Spartan_User: Spartan_User;
    @FormField('Empresa_Solicitante', [''])
    Empresa_Solicitante = null;
    Empresa_Solicitante_Cliente: Cliente;
    @FormField('Motivo_de_viaje', [''])
    Motivo_de_viaje = '';
    @FormField('Fecha_de_Salida', [''])
    Fecha_de_Salida = '';
    @FormField('Hora_de_Salida', [''])
    Hora_de_Salida = '';
    @FormField('Fecha_de_Regreso', [''])
    Fecha_de_Regreso = '';
    @FormField('Hora_de_Regreso', [''])
    Hora_de_Regreso = '';
    @FormField('Detalle_Pasajeros_Solicitud_de_VueloItems', [], Detalle_Pasajeros_Solicitud_de_Vuelo,  true)
    Detalle_Pasajeros_Solicitud_de_VueloItems: FormArray;

    @FormField('Numero_de_Vuelo', [''])
    Numero_de_Vuelo = '';
    @FormField('Ruta_de_Vuelo', [''])
    Ruta_de_Vuelo = '';
    @FormField('Observaciones', [''])
    Observaciones = '';
    @FormField('Estatus', [''])
    Estatus = null;
    Estatus_Estatus_de_Solicitud_de_Vuelo: Estatus_de_Solicitud_de_Vuelo;
    @FormField('Tiempo_de_Vuelo', [''])
    Tiempo_de_Vuelo = '';
    @FormField('Tiempo_de_Espera', [''])
    Tiempo_de_Espera = '';
    @FormField('Espera_SIN_Cargo', [''])
    Espera_SIN_Cargo = '';
    @FormField('Espera_CON_Cargo', [''])
    Espera_CON_Cargo = '';
    @FormField('Pernoctas', [0])
    Pernoctas = null;
    @FormField('Tiempo_de_Calzo', [''])
    Tiempo_de_Calzo = '';
    @FormField('Internacional', [false])
    Internacional = false;
    @FormField('Direccion_fecha_autorizacion', [''])
    Direccion_fecha_autorizacion = '';
    @FormField('Direccion_Hora_Autorizacion', [''])
    Direccion_Hora_Autorizacion = '';
    @FormField('Direccion_Usuario_Autorizacion', [''])
    Direccion_Usuario_Autorizacion = null;
    Direccion_Usuario_Autorizacion_Spartan_User: Spartan_User;
    @FormField('Direccion_Resultado_Autorizacion', [''])
    Direccion_Resultado_Autorizacion = null;
    Direccion_Resultado_Autorizacion_Resultado_de_Autorizacion_de_Vuelo: Resultado_de_Autorizacion_de_Vuelo;
    @FormField('Direccion_Motivo_Rechazo', [''])
    Direccion_Motivo_Rechazo = '';
    @FormField('Presidencia_Fecha_Autorizacion', [''])
    Presidencia_Fecha_Autorizacion = '';
    @FormField('Presidencia_Hora_Autorizacion', [''])
    Presidencia_Hora_Autorizacion = '';
    @FormField('Vuelo_Reabierto', [false])
    Vuelo_Reabierto = false;
    @FormField('Presidencia_Usuario_Autorizacion', [''])
    Presidencia_Usuario_Autorizacion = null;
    Presidencia_Usuario_Autorizacion_Spartan_User: Spartan_User;
    @FormField('Tramos', [0])
    Tramos = null;
    @FormField('TuaNacionales', [0])
    TuaNacionales = null;
    @FormField('TuaInternacionales', [0])
    TuaInternacionales = null;
    @FormField('Presidencia_Resultado_Autorizacion', [''])
    Presidencia_Resultado_Autorizacion = null;
    Presidencia_Resultado_Autorizacion_Resultado_de_Autorizacion_de_Vuelo: Resultado_de_Autorizacion_de_Vuelo;
    @FormField('Presidencia_motivo_rechazo', [''])
    Presidencia_motivo_rechazo = '';

     @FormField('Solicitud_de_Vuelos', [''])
     Solicitud_de_Vuelos: Solicitud_de_Vuelo[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

