import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Spartan_User } from './Spartan_User';
import { Orden_de_Trabajo } from './Orden_de_Trabajo';
import { Tipo_de_Reporte } from './Tipo_de_Reporte';
import { Tipo_de_Ingreso_a_Cotizacion } from './Tipo_de_Ingreso_a_Cotizacion';
import { Cliente } from './Cliente';
import { Aeronave } from './Aeronave';
import { Modelos } from './Modelos';
import { Estatus_de_Cotizacion } from './Estatus_de_Cotizacion';
import { Crear_Reporte } from './Crear_Reporte';
import { Motivo_de_Edicion_de_Cotizacion } from './Motivo_de_Edicion_de_Cotizacion';
import { Detalle_Historial_Motivo_Edicion } from './Detalle_Historial_Motivo_Edicion';
import { Respuesta_del_Cliente_a_Cotizacion } from './Respuesta_del_Cliente_a_Cotizacion';
import {Detalle_Codigos_Computarizados_Cotizacion} from 'src/app/models/Detalle_Codigos_Computarizados_Cotizacion';


export class Cotizacion  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Fecha_de_Registro', [''])
    Fecha_de_Registro = '';
    @FormField('Hora_de_Registro', [''])
    Hora_de_Registro = '';
    @FormField('Usuario_que_Registra', [''])
    Usuario_que_Registra = null;
    Usuario_que_Registra_Spartan_User: Spartan_User;
    @FormField('Numero_de_Cotizacion', [''])
    Numero_de_Cotizacion = '';
    @FormField('Orden_de_Trabajo_Origen', [''])
    Orden_de_Trabajo_Origen = null;
    Orden_de_Trabajo_Origen_Orden_de_Trabajo: Orden_de_Trabajo;
    @FormField('Orden_de_Trabajo_Generada', [''])
    Orden_de_Trabajo_Generada = null;
    Orden_de_Trabajo_Generada_Orden_de_Trabajo: Orden_de_Trabajo;
    @FormField('Tipo_de_Reporte', [''])
    Tipo_de_Reporte = null;
    Tipo_de_Reporte_Tipo_de_Reporte: Tipo_de_Reporte;
    @FormField('Tipo_de_ingreso', [''])
    Tipo_de_ingreso = null;
    Tipo_de_ingreso_Tipo_de_Ingreso_a_Cotizacion: Tipo_de_Ingreso_a_Cotizacion;
    @FormField('Cliente', [''])
    Cliente = null;
    Cliente_Cliente: Cliente;
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('Modelo', [''])
    Modelo = null;
    Modelo_Modelos: Modelos;
    @FormField('Contacto', [''])
    Contacto = '';
    @FormField('Tiempo_de_Ejecucion', [0])
    Tiempo_de_Ejecucion = null;
    @FormField('Enviar_Cotizacion_a_Cliente', [false])
    Enviar_Cotizacion_a_Cliente = false;
    @FormField('Redaccion_Correo_para_Cliente', [''])
    Redaccion_Correo_para_Cliente = '';
    @FormField('Clausulas_Especificas', [''])
    Clausulas_Especificas = '';

    @FormField('Clausulas_Generales', [''])
    Clausulas_Generales = '';

    @FormField('Estatus', [''])
    Estatus = null;
    Estatus_Estatus_de_Cotizacion: Estatus_de_Cotizacion;
    @FormField('Mano_de_Obra', [''])
    Mano_de_Obra = null;
    @FormField('Partes', [''])
    Partes = null;
    @FormField('Consumibles', [''])
    Consumibles = null;
    @FormField('Total', [''])
    Total = null;
    @FormField('Porcentaje_de_Consumibles', [0])
    Porcentaje_de_Consumibles = null;
    @FormField('Porcentaje_de_Anticipo', [0])
    Porcentaje_de_Anticipo = null;
    @FormField('Comentarios_Mantenimiento', [''])
    Comentarios_Mantenimiento = '';
    @FormField('Reporte', [''])
    Reporte = null;
    Reporte_Crear_Reporte: Crear_Reporte;
    @FormField('Item_de_Inspeccion', [0])
    Item_de_Inspeccion = null;
    @FormField('Motivo_de_Edicion', [''])
    Motivo_de_Edicion = null;
    Motivo_de_Edicion_Motivo_de_Edicion_de_Cotizacion: Motivo_de_Edicion_de_Cotizacion;
    @FormField('Observaciones', [''])
    Observaciones = '';
    @FormField('Detalle_Historial_Motivo_EdicionItems', [], Detalle_Historial_Motivo_Edicion,  true)
    Detalle_Historial_Motivo_EdicionItems: FormArray;

    @FormField('Detalle_Codigos_Computarizados_CotizacionItems', [], Detalle_Codigos_Computarizados_Cotizacion,  true)
    Detalle_Codigos_Computarizados_Cotizacion: FormArray;

    @FormField('Fecha_de_Respuesta', [''])
    Fecha_de_Respuesta = '';
    @FormField('Hora_de_Respuesta', [''])
    Hora_de_Respuesta = '';
    @FormField('Usuario_que_Registra_Respuesta', [''])
    Usuario_que_Registra_Respuesta = null;
    Usuario_que_Registra_Respuesta_Spartan_User: Spartan_User;
    @FormField('Respuesta', [''])
    Respuesta = null;
    Respuesta_Respuesta_del_Cliente_a_Cotizacion: Respuesta_del_Cliente_a_Cotizacion;
    @FormField('Observaciones_Respeusta', [''])
    Observaciones_Respeusta = '';
    @FormField('Dia_de_Llegada_del_Avion', [''])
    Dia_de_Llegada_del_Avion = '';
    @FormField('Hora_de_Llegada_del_Avion', [''])
    Hora_de_Llegada_del_Avion = '';

     @FormField('Cotizacions', [''])
     Cotizacions: Cotizacion[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

