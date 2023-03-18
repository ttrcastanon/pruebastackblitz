import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Spartan_User } from './Spartan_User';
import { Tipo_Persona_Notificar } from './Tipo_Persona_Notificar';

import { Funcionalidades_para_Notificacion } from './Funcionalidades_para_Notificacion';
import { Tipo_de_Notificacion } from './Tipo_de_Notificacion';
import { Tipo_de_Accion_Notificacion } from './Tipo_de_Accion_Notificacion';
import { Tipo_de_Recordatorio_Notificacion } from './Tipo_de_Recordatorio_Notificacion';
import { Nombre_del_Campo_en_MS } from './Nombre_del_Campo_en_MS';
import { Estatus_Notificacion } from './Estatus_Notificacion';
import { Detalle_Frecuencia_Notificaciones } from './Detalle_Frecuencia_Notificaciones';


export class Configuracion_de_Notificacion  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Fecha_de_Registro', [''])
    Fecha_de_Registro = '';
    @FormField('Hora_de_Registro', [''])
    Hora_de_Registro = '';
    @FormField('Usuario_que_Registra', [''])
    Usuario_que_Registra = null;
    Usuario_que_Registra_Spartan_User: Spartan_User;
    @FormField('Nombre_de_la_Notificacion', [''])
    Nombre_de_la_Notificacion = '';
    @FormField('Dirigido_a', [''])    
    Dirigido_a : [] = [];

    @FormField('Es_Permanente', [false])
    Es_Permanente = false;     @FormField('Funcionalidad', [''])
    Funcionalidad = null;
    Funcionalidad_Funcionalidades_para_Notificacion: Funcionalidades_para_Notificacion;     @FormField('Tipo_de_Notificacion', [''])
    Tipo_de_Notificacion = null;
    Tipo_de_Notificacion_Tipo_de_Notificacion: Tipo_de_Notificacion;     @FormField('Tipo_de_Accion', [''])
    Tipo_de_Accion = null;
    Tipo_de_Accion_Tipo_de_Accion_Notificacion: Tipo_de_Accion_Notificacion;     @FormField('Tipo_de_Recordatorio', [''])
    Tipo_de_Recordatorio = null;
    Tipo_de_Recordatorio_Tipo_de_Recordatorio_Notificacion: Tipo_de_Recordatorio_Notificacion;     @FormField('Fecha_de_Inicio', [''])
    Fecha_de_Inicio = '';     @FormField('Tiene_Fecha_de_Finalizacion_Definida', [false])
    Tiene_Fecha_de_Finalizacion_Definida = false;     @FormField('Cantidad_de_Dias_a_Validar', [0])
    Cantidad_de_Dias_a_Validar = null;     @FormField('Fecha_a_Validar', [''])
    Fecha_a_Validar = null;
    Fecha_a_Validar_Nombre_del_Campo_en_MS: Nombre_del_Campo_en_MS;     @FormField('Fecha_Fin', [''])
    Fecha_Fin = '';     @FormField('Estatus', [''])
    Estatus = null;
    Estatus_Estatus_Notificacion: Estatus_Notificacion;     @FormField('Notificar__por_Correo', [false])
    Notificar__por_Correo = false;     @FormField('Texto_que_llevara_el_Correo', [''])
    Texto_que_llevara_el_Correo = '';     @FormField('Notificacion_push', [false])
    Notificacion_push = false;     @FormField('Texto_a_Mostrar_en_la_Notificacion_push', [''])
    Texto_a_Mostrar_en_la_Notificacion_push = '';     @FormField('Detalle_Frecuencia_NotificacionesItems', [], Detalle_Frecuencia_Notificaciones,  true)
    Detalle_Frecuencia_NotificacionesItems: FormArray;
 
     @FormField('Configuracion_de_Notificacions', [''])
     Configuracion_de_Notificacions: Configuracion_de_Notificacion[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

