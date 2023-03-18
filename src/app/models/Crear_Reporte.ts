import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Orden_de_Trabajo } from './Orden_de_Trabajo';
import { Orden_de_servicio } from './Orden_de_servicio';
import { Tipo_orden_de_servicio } from './Tipo_orden_de_servicio';
import { Prioridad_del_Reporte } from './Prioridad_del_Reporte';
import { Tipo_de_Orden_de_Trabajo } from './Tipo_de_Orden_de_Trabajo';
import { Estatus_de_Reporte } from './Estatus_de_Reporte';
import { Aeronave } from './Aeronave';
import { Tipo_de_origen_del_reporte } from './Tipo_de_origen_del_reporte';
import { Codigo_Computarizado } from './Codigo_Computarizado';
import { Tipo_de_Reporte } from './Tipo_de_Reporte';
import { Catalogo_codigo_ATA } from './Catalogo_codigo_ATA';
import { Detalle_Solicitud_de_Partes_Crear_reporte } from './Detalle_Solicitud_de_Partes_Crear_reporte';
import { Detalle_Solicitud_de_Servicios_Crear_reporte } from './Detalle_Solicitud_de_Servicios_Crear_reporte';
import { Detalle_Solicitud_de_Materiales_Crear_reporte } from './Detalle_Solicitud_de_Materiales_Crear_reporte';
import { Detalle_Solicitud_de_Herramientas_Crear_reporte } from './Detalle_Solicitud_de_Herramientas_Crear_reporte';
import { Detalle_de_Remocion_de_piezas } from './Detalle_de_Remocion_de_piezas';
import { Detalle_de_Instalacion_de_piezas } from './Detalle_de_Instalacion_de_piezas';
import { Detalle_tiempo_ejecutantes_crear_reporte } from './Detalle_tiempo_ejecutantes_crear_reporte';
import { Spartan_User } from './Spartan_User';
import { Ayuda_de_respuesta_crear_reporte } from './Ayuda_de_respuesta_crear_reporte';
import { Resultado_aprobacion_crear_reporte } from './Resultado_aprobacion_crear_reporte';


export class Crear_Reporte  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('No_Reporte', [''])
    No_Reporte = '';
    @FormField('N_Orden_de_Trabajo', [''])
    N_Orden_de_Trabajo = null;
    N_Orden_de_Trabajo_Orden_de_Trabajo: Orden_de_Trabajo;
    @FormField('No__de_Orden_de_Servicio', [''])
    No__de_Orden_de_Servicio = null;
    No__de_Orden_de_Servicio_Orden_de_servicio: Orden_de_servicio;
    @FormField('Descripcion_breve', [''])
    Descripcion_breve = '';
    @FormField('Tipo_de_reporte_OS', [''])
    Tipo_de_reporte_OS = null;
    Tipo_de_reporte_OS_Tipo_orden_de_servicio: Tipo_orden_de_servicio;
    @FormField('Descripcion_del_componente', [''])
    Descripcion_del_componente = '';
    @FormField('Numero_de_parte', [''])
    Numero_de_parte = '';
    @FormField('Numero_de_serie', [''])
    Numero_de_serie = '';
    @FormField('Fecha_requerida', [''])
    Fecha_requerida = '';
    @FormField('Promedio_de_ejecucion', [''])
    Promedio_de_ejecucion = null;
    @FormField('Prioridad_del_reporte', [''])
    Prioridad_del_reporte = null;
    Prioridad_del_reporte_Prioridad_del_Reporte: Prioridad_del_Reporte;
    @FormField('Tipo_de_orden_de_trabajo', [''])
    Tipo_de_orden_de_trabajo = null;
    Tipo_de_orden_de_trabajo_Tipo_de_Orden_de_Trabajo: Tipo_de_Orden_de_Trabajo;
    @FormField('Estatus', [''])
    Estatus = null;
    Estatus_Estatus_de_Reporte: Estatus_de_Reporte;
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('Origen_del_reporte', [''])
    Origen_del_reporte = null;
    Origen_del_reporte_Tipo_de_origen_del_reporte: Tipo_de_origen_del_reporte;
    @FormField('Codigo_computarizado_Descripcion', [''])
    Codigo_computarizado_Descripcion = null;
    Codigo_computarizado_Descripcion_Codigo_Computarizado: Codigo_Computarizado;
    @FormField('Ciclos_restantes', [0])
    Ciclos_restantes = null;
    @FormField('Horas_restantes', [0])
    Horas_restantes = null;
    @FormField('N_boletin_directiva', [''])
    N_boletin_directiva = '';
    @FormField('Titulo_boletin_directiva', [''])
    Titulo_boletin_directiva = '';
    @FormField('Tipo_de_reporte', [''])
    Tipo_de_reporte = null;
    Tipo_de_reporte_Tipo_de_Reporte: Tipo_de_Reporte;
    @FormField('Reporte_de_aeronave', [''])
    Reporte_de_aeronave = '';
    @FormField('N_de_bitacora', [''])
    N_de_bitacora = '';
    @FormField('Codigo_ATA', [''])
    Codigo_ATA = null;
    Codigo_ATA_Catalogo_codigo_ATA: Catalogo_codigo_ATA;
    @FormField('IdDiscrepancia', [0])
    IdDiscrepancia = null;
    @FormField('Id_Inspeccion_de_Entrada', [0])
    Id_Inspeccion_de_Entrada = null;
    @FormField('IdCotizacion', [0])
    IdCotizacion = null;
    @FormField('Fecha_de_Creacion_del_Reporte', [''])
    Fecha_de_Creacion_del_Reporte = '';
    @FormField('Hora_de_Creacion_del_Reporte', [''])
    Hora_de_Creacion_del_Reporte = '';
    @FormField('Fecha_de_Asignacion', [''])
    Fecha_de_Asignacion = '';
    @FormField('Hora_de_Asignacion', [''])
    Hora_de_Asignacion = '';
    @FormField('Notas', [''])
    Notas = '';
    @FormField('Detalle_Solicitud_de_Partes_Crear_reporteItems', [], Detalle_Solicitud_de_Partes_Crear_reporte,  true)
    Detalle_Solicitud_de_Partes_Crear_reporteItems: FormArray;

    @FormField('Detalle_Solicitud_de_Servicios_Crear_reporteItems', [], Detalle_Solicitud_de_Servicios_Crear_reporte,  true)
    Detalle_Solicitud_de_Servicios_Crear_reporteItems: FormArray;

    @FormField('Detalle_Solicitud_de_Materiales_Crear_reporteItems', [], Detalle_Solicitud_de_Materiales_Crear_reporte,  true)
    Detalle_Solicitud_de_Materiales_Crear_reporteItems: FormArray;

    @FormField('Detalle_Solicitud_de_Herramientas_Crear_reporteItems', [], Detalle_Solicitud_de_Herramientas_Crear_reporte,  true)
    Detalle_Solicitud_de_Herramientas_Crear_reporteItems: FormArray;

    @FormField('Detalle_de_Remocion_de_piezasItems', [], Detalle_de_Remocion_de_piezas,  true)
    Detalle_de_Remocion_de_piezasItems: FormArray;

    @FormField('Detalle_de_Instalacion_de_piezasItems', [], Detalle_de_Instalacion_de_piezas,  true)
    Detalle_de_Instalacion_de_piezasItems: FormArray;

    @FormField('Detalle_tiempo_ejecutantes_crear_reporteItems', [], Detalle_tiempo_ejecutantes_crear_reporte,  true)
    Detalle_tiempo_ejecutantes_crear_reporteItems: FormArray;

    @FormField('Tiempo_total_de_ejecucion', [''])
    Tiempo_total_de_ejecucion = null;
    @FormField('Fecha_resp', [''])
    Fecha_resp = '';
    @FormField('Hora_resp', [''])
    Hora_resp = '';
    @FormField('Respondiente_resp', [''])
    Respondiente_resp = null;
    Respondiente_resp_Spartan_User: Spartan_User;
    @FormField('Ayuda_de_respuesta_resp', [''])
    Ayuda_de_respuesta_resp = null;
    Ayuda_de_respuesta_resp_Ayuda_de_respuesta_crear_reporte: Ayuda_de_respuesta_crear_reporte;
    @FormField('Respuesta_resp', [''])
    Respuesta_resp = '';
    @FormField('Fecha_sup', [''])
    Fecha_sup = '';
    @FormField('Hora_sup', [''])
    Hora_sup = '';
    @FormField('Supervisor', [''])
    Supervisor = null;
    Supervisor_Spartan_User: Spartan_User;
    @FormField('Resultado_sup', [''])
    Resultado_sup = null;
    Resultado_sup_Resultado_aprobacion_crear_reporte: Resultado_aprobacion_crear_reporte;
    @FormField('Tiempo_ejecucion_Hrs_sup', [0])
    Tiempo_ejecucion_Hrs_sup = null;
    @FormField('Observaciones_sup', [''])
    Observaciones_sup = '';
    @FormField('Fecha_ins', [''])
    Fecha_ins = '';
    @FormField('Hora_ins', [''])
    Hora_ins = '';
    @FormField('Inspector', [''])
    Inspector = null;
    Inspector_Spartan_User: Spartan_User;
    @FormField('Resultado_ins', [''])
    Resultado_ins = null;
    Resultado_ins_Resultado_aprobacion_crear_reporte: Resultado_aprobacion_crear_reporte;
    @FormField('Tiempo_ejecucion_Hrs_ins', [0])
    Tiempo_ejecucion_Hrs_ins = null;
    @FormField('Observaciones_ins', [''])
    Observaciones_ins = '';
    @FormField('Fecha_pro', [''])
    Fecha_pro = '';
    @FormField('Hora_pro', [''])
    Hora_pro = '';
    @FormField('Programador_de_mantenimiento', [''])
    Programador_de_mantenimiento = null;
    Programador_de_mantenimiento_Spartan_User: Spartan_User;
    @FormField('Resultado_pro', [''])
    Resultado_pro = null;
    Resultado_pro_Resultado_aprobacion_crear_reporte: Resultado_aprobacion_crear_reporte;
    @FormField('Tiempo_ejecucion_Hrs_pro', [0])
    Tiempo_ejecucion_Hrs_pro = null;
    @FormField('Observaciones_pro', [''])
    Observaciones_pro = '';

     @FormField('Crear_Reportes', [''])
     Crear_Reportes: Crear_Reporte[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

